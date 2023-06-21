import { Flex, Text, Icon, HStack, Button, Skeleton } from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import { calcOrderQuantity } from "../utils";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { getDatetimeString } from "../datetime";
import { USER_TYPE, invertUserType } from "../enum";
import { useUser } from "../api/swr";
import ReviewModal from "./ReviewModal";
import ErrorHandler from "../pages/ErrorHandler";

function OrderCard({ order, userType, mutateOrders }) {
  const { user, isLoading, isError } = useUser(
    invertUserType(userType),
    userType === USER_TYPE.CUSTOMER ? order.shopId : order.userId
  );
  if (isError) ErrorHandler("Error fetching order metadata", "/", false);

  const navigate = useNavigate();
  return (
    <Flex
      w="100%"
      h="28"
      bg="white"
      justifyContent="space-between"
      alignItems="start"
      flexDirection="column"
      rounded="lg"
      shadow="md"
      my="2"
      px="6"
      py="3"
    >
      <Flex w="100%" justifyContent="start" alignItems="center">
        <Icon as={FaClipboardList} boxSize="6" color="gray.500" mr="2" />
        <Flex
          w="100%"
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
        >
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <OrderStatusBadge status={order.status} size="lg" />
          </Flex>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Skeleton isLoaded={!isLoading}>
              <Text fontSize="xl" fontWeight="700" color="gray.600">
                {isLoading ? "Loading..." : user.data.name}
              </Text>
            </Skeleton>
            <Text fontSize="sm" fontWeight="600" color="gray.500">
              {calcOrderQuantity(order) + " items · $" + order.price.toFixed(2)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="sm" fontWeight="500" color="gray.500">
          {getDatetimeString(order.createdTime, true)}
        </Text>
        <HStack spacing="2">
          <Button
            size="sm"
            colorScheme="green"
            variant="ghost"
            onClick={() => navigate("/orders/" + order._id)}
          >
            Manage
          </Button>
          <ReviewModal
            order={order}
            subjectData={user?.data}
            subjectDataIsLoading={isLoading}
            userType={userType}
            mutateOrders={mutateOrders}
            size="sm"
          />
        </HStack>
      </Flex>
    </Flex>
  );
}

OrderCard.defaultProps = {};
OrderCard.propTypes = {
  order: propTypes.object.isRequired,
  userType: propTypes.number.isRequired,
  mutateOrders: propTypes.func.isRequired,
};

export default OrderCard;
