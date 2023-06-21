import { useState } from "react";
import { useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import { getAccountTypeByToken } from "../utils";
import {
  Flex,
  Box,
  Text,
  HStack,
  Button,
  Tag,
  Divider,
  useToast,
} from "@chakra-ui/react";
import Loading from "./Loading";
import ErrorHandler from "./ErrorHandler";
import NoResultPlaceholder from "../components/NoResultPlaceholder";
import ReviewModal from "../components/ReviewModal";
import { ORDER_STATUS, USER_TYPE } from "../enum";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { getDatetimeString } from "../datetime";
import { ORDER_TYPE_MAP } from "../mapping";
import { fetcher, useOrder } from "../api/swr";
import useSWR from "swr";
import { cancelOrder, completeOrder, confirmOrder } from "../api/orders";
function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [isConfirmingOrCompleting, setIsConfirmingOrCompleting] =
    useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const userType = getAccountTypeByToken(
    localStorage.getItem("SHAREPLATE_TOKEN")
  );
  const { order, mutate, isError } = useOrder(id);
  const { data: user, error: isUserError } = useSWR(() => {
    const userId =
      userType === USER_TYPE.CUSTOMER
        ? order.order[0].shopId
        : order.order[0].userId;
    const baseUrl = `${import.meta.env.VITE_API_ENDPOINT}`;
    const url = `${baseUrl}/${
      userType === USER_TYPE.CUSTOMER ? "shops" : "customers"
    }/${userId}`;
    return url;
  }, fetcher);
  if (isError || isUserError)
    ErrorHandler("Error fetching order data", "/orders", false);
  if (!user) return <Loading />;
  const subjectData = user.data;
  const orderData = order.order[0];

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const resp = await cancelOrder(orderData._id);
      if (resp.status === 200) {
        toast({
          title: "Order cancelled",
          description: "The order has been cancelled",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
        setIsCancelling(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsCancelling(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirmingOrCompleting(true);
    try {
      const resp = await confirmOrder(orderData._id);
      if (resp.status === 200) {
        toast({
          title: "Order confirmed",
          description: "The order has been confirmed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
        setIsConfirmingOrCompleting(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsConfirmingOrCompleting(false);
    }
  };

  const handleComplete = async () => {
    setIsConfirmingOrCompleting(true);
    try {
      const resp = await completeOrder(orderData._id);
      if (resp.status === 200) {
        toast({
          title: "Order completed",
          description: "The order has been completed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
        setIsConfirmingOrCompleting(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsConfirmingOrCompleting(false);
    }
  };

  return (
    <>
      <HeaderBar userType={userType} />
      <Box bg="white" w="100%" pt="64px" px="6" minH="85vh">
        <Box w="100%" position="sticky" top="64px" zIndex="1" bg="white" py="4">
          <Text
            fontSize="3xl"
            fontWeight="700"
            textAlign="start"
            color="green.500"
          >
            {`Order with ${subjectData.name}`}
          </Text>
        </Box>
        <Flex flexDirection="column" justifyContent="center" alignItems="start">
          <Text fontSize="sm" fontWeight="700" color="gray.500">
            Order ID: {orderData._id}
          </Text>
          <HStack spacing="2" alignItems="center" mt="1">
            <OrderStatusBadge status={orderData.status} />
            <Text fontSize="sm" fontWeight="600" color="gray.500">
              {getDatetimeString(orderData.createdTime, true)}
            </Text>
          </HStack>
          <Tag size="md" colorScheme="green" my="2" fontWeight="700">
            {ORDER_TYPE_MAP[orderData.type]}
          </Tag>
          <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="8" mb="2">
            Items
          </Text>
          {orderData.foods.map((food, index) => {
            return (
              <Flex
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                my="2"
                key={index}
              >
                <HStack spacing="4">
                  <Tag
                    size="md"
                    colorScheme="green"
                    variant="solid"
                    fontWeight="600"
                    fontSize="md"
                    textAlign="center"
                  >
                    {food.quantity}
                  </Tag>
                  <Text fontSize="lg" fontWeight="600" color="gray.600">
                    {food.foodName}
                  </Text>
                </HStack>
                <Text fontSize="lg" fontWeight="600" color="gray.500">
                  {`$${food.price.toFixed(2)}`}
                </Text>
              </Flex>
            );
          })}
          <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            mt="2"
          >
            <Text fontSize="xl" fontWeight="700" color="gray.500">
              Total
            </Text>
            <Divider orientation="horizontal" w="100%" mx="4" />
            <Text fontSize="lg" fontWeight="600" color="gray.600">
              {`$${orderData.price.toFixed(2)}`}
            </Text>
          </Flex>
          <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="8" mb="2">
            Details
          </Text>
          <NoResultPlaceholder text="No details" />
          <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="8" mb="2">
            Manage
          </Text>
          <ReviewModal
            w="100%"
            size="md"
            my="1"
            variant="outline"
            order={orderData}
            subjectData={subjectData}
            userType={userType}
            mutateOrders={mutate}
          />
          <Flex w="100%" justifyContent="center" alignItems="center" my="1">
            <Button
              w="100%"
              size="lg"
              colorScheme="red"
              display={"block"} // userType === USER_TYPE.SHOP ? "block" : "none"}
              isDisabled={orderData.status !== ORDER_STATUS.PENDING}
              onClick={() => handleCancel()}
              isLoading={isCancelling}
            >
              Cancel
            </Button>
            <Button
              w="100%"
              ml="2"
              size="lg"
              colorScheme="green"
              display={
                orderData.status === ORDER_STATUS.PENDING &&
                userType === USER_TYPE.SHOP
                  ? "block"
                  : "none"
              }
              onClick={() => handleConfirm()}
              isLoading={isConfirmingOrCompleting}
            >
              Confirm
            </Button>
            <Button
              w="100%"
              ml="2"
              size="lg"
              colorScheme="green"
              display={
                orderData.status === ORDER_STATUS.CONFIRMED &&
                userType === USER_TYPE.SHOP
                  ? "block"
                  : "none"
              }
              onClick={() => handleComplete()}
              isLoading={isConfirmingOrCompleting}
            >
              Complete
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Footer />
    </>
  );
}

OrderDetail.defaultProps = {};
OrderDetail.propTypes = {};

export default OrderDetail;
