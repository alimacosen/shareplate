import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaDirections,
  FaEye,
  FaEyeSlash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaStoreSlash,
} from "react-icons/fa";
import {
  Flex,
  Image,
  Text,
  Tag,
  Button,
  HStack,
  Divider,
  TagLeftIcon,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import HeaderBar from "../../components/HeaderBar";
import { USER_TYPE } from "../../enum";
import Footer from "../../components/Footer";
import { useShop } from "../../api/swr";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import ShopStatusBadge from "../../components/ShopStatusBadge";
import sharePlateCover from "../../images/shareplate_cover.png";
import { SHOP_TYPE_MAP } from "../../mapping";
import ListEndText from "../../components/ListEndText";
import {
  calcAvgRating,
  requestPosition,
  generateGoogleMapDirectionLink,
  getCurrentOrderPrice,
} from "../../utils";
import PlaceOrderModal from "../../components/PlaceOrderModal";
import { subscribeShop, unsubscribeShop } from "../../api/shops";

function ShopDetail() {
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState({});
  const [isDirectionBtnLoading, setIsDirectionBtnLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [
    isSubscribeUnsubscribeBtnLoading,
    setIsSubscribeUnsubscribeBtnLoading,
  ] = useState(false);
  const { id } = useParams();
  const { shop, mutate: mutateShop, isError, isLoading } = useShop(id);
  if (isLoading) return <Loading />;
  if (isError)
    return ErrorHandler("Error fetching shop or user data", "/shops", false);

  const shopData = shop.data;
  const customerId = localStorage.getItem("SHAREPLATE_ID");
  const foods = shopData.menu;

  const handleAdjustOrder = (foodId, value) => {
    const newOrder = { ...order };
    newOrder[foodId] = value;
    if (value === 0) {
      delete newOrder[foodId];
    } else {
      newOrder[foodId] = value;
    }
    setOrder(newOrder);
  };

  const handleDirectionClick = () => {
    setIsDirectionBtnLoading(true);
    requestPosition().then((pos) => {
      const { latitude, longitude } = pos.coords;
      const url = generateGoogleMapDirectionLink(
        latitude,
        longitude,
        shopData.location.coordinates[0],
        shopData.location.coordinates[1]
      );
      setIsDirectionBtnLoading(false);
      window.open(url, "_blank");
    });
  };

  const isSubscribed = shopData.subscribers.includes(customerId);

  const handleSubscribeUnsubscribeClick = async () => {
    setIsSubscribeUnsubscribeBtnLoading(true);
    await new Promise((r) => setTimeout(r, 2000)); // eslint-disable-line
    let f;
    if (isSubscribed) {
      f = unsubscribeShop;
    } else {
      f = subscribeShop;
    }
    try {
      const resp = await f(id);
      if (resp.status === 200) {
        mutateShop();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Oops! Something went wrong. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsSubscribeUnsubscribeBtnLoading(false);
    }
    setIsSubscribeUnsubscribeBtnLoading(false);
  };

  return (
    <>
      <HeaderBar userType={USER_TYPE.CUSTOMER} />
      <PlaceOrderModal
        shopData={shopData}
        foods={foods}
        order={order}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        pt="64px"
        pb="5"
        h="85vh"
        overflowY="scroll"
      >
        <Image
          w="100%"
          h="200px"
          src={shopData.image}
          fallbackSrc={sharePlateCover}
          objectFit="cover"
          filter={shopData.available ? "" : "grayscale(100%)"}
        />
        <Flex
          w="90%"
          justifyContent="end"
          alignItems="center"
          mt="-12"
          mb="2"
          pb="4"
        >
          <Button
            mr="2"
            size="sm"
            colorScheme={isSubscribed ? "red" : "blue"}
            boxShadow="xl"
            leftIcon={isSubscribed ? <FaEyeSlash /> : <FaEye />}
            onClick={async () => await handleSubscribeUnsubscribeClick()}
            isLoading={isSubscribeUnsubscribeBtnLoading}
            loadingText="Loading..."
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            boxShadow="xl"
            leftIcon={<FaDirections />}
            onClick={() => handleDirectionClick()}
            isLoading={isDirectionBtnLoading}
            loadingText="Routing..."
            isDisabled={!shopData.location?.type}
          >
            Direction
          </Button>
        </Flex>
        <Flex w="90%" flexDirection="column" alignItems="start" my="1">
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text fontSize="3xl" fontWeight="700" color="green.500">
              {shopData.name}
            </Text>
            <ShopStatusBadge status={shopData.available} fontSize="md" />
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            mt="1"
          >
            <Flex w="100%" flexDirection="column" alignItems="start">
              <Text fontSize="sm" fontWeight="500" color="gray.500" mt="1">
                {shopData.description || "No description provided."}
              </Text>
              <Flex
                w="100%"
                justifyContent="start"
                alignItems="center"
                mt="2"
                flexWrap="wrap"
              >
                {shopData.shopType.map((type) => {
                  return (
                    <Tag
                      px="2"
                      mt="2"
                      key={type}
                      fontSize="md"
                      fontWeight="500"
                      color="gray.500"
                      mr="2"
                    >
                      {SHOP_TYPE_MAP[type]}
                    </Tag>
                  );
                })}
              </Flex>
            </Flex>
            <Button
              size="md"
              colorScheme="yellow"
              leftIcon={<FaStar />}
              rounded="full"
              onClick={() => {
                navigate(`/shops/${id}/reviews`);
              }}
            >
              {calcAvgRating(shopData.reviews)}
            </Button>
          </Flex>
          <Flex
            w="100%"
            flexDirection="column"
            justifyContent="start"
            alignItems="center"
            mt="2"
          >
            {foods.map((food) => {
              return (
                <>
                  <Flex
                    w="100%"
                    my="4"
                    justifyContent="start"
                    alignItems="center"
                    key={food._id}
                  >
                    <Flex w="80px" flexDirection="column" alignItems="end">
                      <Image
                        w="80px"
                        h="80px"
                        src={food.image}
                        fallbackSrc={sharePlateCover}
                        objectFit="cover"
                      />
                      <HStack mt="-20px">
                        <Tag colorScheme="green" size="md" rounded="full">
                          <TagLeftIcon as={FaBoxOpen} mr="1" />
                          {`${food.quantity}`}
                        </Tag>
                      </HStack>
                    </Flex>
                    <Flex
                      flexDirection="column"
                      justifyContent="start"
                      alignItems="start"
                      ml="4"
                      flexGrow="1"
                    >
                      <Text fontSize="xl" fontWeight="700" color="gray.600">
                        {food.foodName}
                      </Text>
                      <Text fontSize="sm" fontWeight="500" color="gray.500">
                        {food.description}
                      </Text>
                      <Text fontSize="lg" fontWeight="600" color="gray.500">
                        {`$${food.price.toFixed(2)}`}
                      </Text>
                    </Flex>
                    <HStack>
                      <Button
                        h="8"
                        px="1"
                        colorScheme="green"
                        size="sm"
                        isDisabled={
                          !order[food._id] ||
                          order[food._id] <= 0 ||
                          !shopData.available
                        }
                        onClick={() =>
                          handleAdjustOrder(
                            food._id,
                            (order[food._id] || 0) - 1
                          )
                        }
                      >
                        <FaMinus />
                      </Button>
                      <Text
                        w="8"
                        color={order[food._id] ? "green.500" : "gray.300"}
                        fontSize="2xl"
                        fontWeight="700"
                        textAlign="center"
                      >
                        {order[food._id] || 0}
                      </Text>
                      <Button
                        h="8"
                        px="1"
                        colorScheme="green"
                        size="sm"
                        isDisabled={
                          order[food._id] === food.quantity ||
                          !shopData.available
                        }
                        onClick={() =>
                          handleAdjustOrder(
                            food._id,
                            (order[food._id] || 0) + 1
                          )
                        }
                      >
                        <FaPlus />
                      </Button>
                    </HStack>
                  </Flex>
                  <Divider />
                </>
              );
            })}
            <ListEndText />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        position="fixed"
        bottom="0"
        left="0"
        bg="white"
        py="4"
      >
        <Flex w="90%" justifyContent="space-between" alignItems="center" mb="2">
          <Text fontSize="xl" fontWeight="700" color="gray.500">
            Total
          </Text>
          <Divider orientation="horizontal" w="100%" mx="4" />
          <Text fontSize="xl" fontWeight="700" color="gray.600">
            {`$${getCurrentOrderPrice(order, foods)}`}
          </Text>
        </Flex>
        <Button
          colorScheme="green"
          w="90%"
          h="12"
          fontSize="xl"
          leftIcon={shopData.available ? <FaShoppingCart /> : <FaStoreSlash />}
          isDisabled={Object.keys(order).length === 0 || !shopData.available}
          onClick={() => onOpen()}
        >
          {shopData.available ? "Checkout" : "Unavailable"}
        </Button>
        <Footer />
      </Flex>
    </>
  );
}

ShopDetail.defaultProps = {};

ShopDetail.propTypes = {};

export default ShopDetail;
