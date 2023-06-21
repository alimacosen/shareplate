import {
  Flex,
  Input,
  HStack,
  Tag,
  Text,
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  useToast,
} from "@chakra-ui/react";
import Proptypes from "prop-types";
import { getCurrentOrderPrice } from "../utils";
import { useState } from "react";
import { BOX_PRICE, ORDER_TYPE } from "../enum";
import { FaMinus, FaPlus } from "react-icons/fa";
import { placeOrder } from "../api/orders";
function PlaceOrderModal({ shopData, foods, order, isOpen, onClose }) {
  const toast = useToast();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderType, setOrderType] = useState(ORDER_TYPE.BASIC);
  const [boxNum, setBoxNum] = useState(0);
  const [curbsideData, setCurbsideData] = useState({
    pickupLocation: "",
    carInfo: {
      brand: "",
      color: "",
      plateNo: "",
    },
  });

  const isOrderable = () => {
    switch (orderType) {
      case ORDER_TYPE.BASIC:
        return true;
      case ORDER_TYPE.TOGOBOX:
        return boxNum > 0;
      case ORDER_TYPE.CURBSIDE:
        return (
          curbsideData.pickupLocation !== "" &&
          curbsideData.carInfo.brand !== "" &&
          curbsideData.carInfo.color !== "" &&
          curbsideData.carInfo.plateNo !== ""
        );
      default:
        return false;
    }
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    try {
      const items = Object.keys(order).map((foodId) => ({
        foodId,
        quantity: order[foodId],
      }));
      const payload = {
        userId: localStorage.getItem("SHAREPLATE_ID"),
        shopId: shopData._id,
        type: orderType,
        items,
        boxNum,
        pickupLocation: curbsideData.pickupLocation,
        carInfo: curbsideData.carInfo,
      };
      const resp = await placeOrder(payload);
      if (resp.status === 200) {
        toast({
          title: "Order placed",
          description: "Your order has been placed successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsOrdering(false);
        onClose();
      }
    } catch (err) {
      setIsOrdering(false);
      toast({
        title: "Error",
        description: "An error occurred while placing your order.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderPreferences = () => {
    switch (orderType) {
      case ORDER_TYPE.BASIC:
        return (
          <>
            <Text fontSize="md" fontWeight="500" color="gray.400">
              No preferences available.
            </Text>
          </>
        );
      case ORDER_TYPE.TOGOBOX:
        return (
          <>
            <Flex w="100%" my="4" justifyContent="start" alignItems="center">
              <Flex
                flexDirection="column"
                justifyContent="start"
                alignItems="start"
                flexGrow="1"
              >
                <Text fontSize="lg" fontWeight="600" color="gray.600">
                  TOGO Box
                </Text>
                <Text fontSize="md" fontWeight="500" color="gray.500">
                  {`$${BOX_PRICE.toFixed(2)}`}
                </Text>
              </Flex>
              <HStack>
                <Button
                  h="8"
                  px="1"
                  colorScheme="green"
                  size="sm"
                  isDisabled={boxNum <= 1}
                  onClick={() => setBoxNum(boxNum - 1)}
                >
                  <FaMinus />
                </Button>
                <Text
                  w="8"
                  color={boxNum > 0 ? "green.500" : "gray.300"}
                  fontSize="2xl"
                  fontWeight="700"
                  textAlign="center"
                >
                  {boxNum}
                </Text>
                <Button
                  h="8"
                  px="1"
                  colorScheme="green"
                  size="sm"
                  onClick={() => setBoxNum(boxNum + 1)}
                >
                  <FaPlus />
                </Button>
              </HStack>
            </Flex>
          </>
        );
      case ORDER_TYPE.CURBSIDE:
        return (
          <>
            <Text fontSize="sm" fontWeight="600" color="gray.500">
              Pick-up Location
            </Text>
            <Input
              placeholder="Enter your pick-up location"
              focusBorderColor="green.500"
              onChange={(e) => {
                setCurbsideData({
                  ...curbsideData,
                  pickupLocation: e.target.value,
                });
              }}
            />
            <Text fontSize="sm" fontWeight="600" color="gray.500" mt="4">
              Car Brand
            </Text>
            <Input
              placeholder="Enter your car brand"
              focusBorderColor="green.500"
              onChange={(e) => {
                setCurbsideData({
                  ...curbsideData,
                  carInfo: {
                    ...curbsideData.carInfo,
                    brand: e.target.value,
                  },
                });
              }}
            />
            <Text fontSize="sm" fontWeight="600" color="gray.500" mt="4">
              Car Color
            </Text>
            <Input
              placeholder="Enter your car color"
              focusBorderColor="green.500"
              onChange={(e) => {
                setCurbsideData({
                  ...curbsideData,
                  carInfo: {
                    ...curbsideData.carInfo,
                    color: e.target.value,
                  },
                });
              }}
            />
            <Text fontSize="sm" fontWeight="600" color="gray.500" mt="4">
              Plate No.
            </Text>
            <Input
              placeholder="Enter your license plate number"
              focusBorderColor="green.500"
              onChange={(e) => {
                setCurbsideData({
                  ...curbsideData,
                  carInfo: {
                    ...curbsideData.carInfo,
                    plateNo: e.target.value,
                  },
                });
              }}
            />
          </>
        );
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`Order from ${shopData.name}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="xl" fontWeight="700" color="gray.600">
              Items
            </Text>
            {Object.keys(order).map((orderItem, index) => {
              const food = foods.find((food) => food._id === orderItem);
              const quantity = order[orderItem];
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
                      {quantity}
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
            <Text fontSize="xl" fontWeight="700" color="gray.600" mt="8" mb="2">
              Order Type
            </Text>
            <ButtonGroup
              size="sm"
              isAttached
              variant="outline"
              colorScheme="green"
            >
              <Button
                variant={orderType === ORDER_TYPE.BASIC ? "solid" : "outline"}
                onClick={() => setOrderType(ORDER_TYPE.BASIC)}
              >
                Normal
              </Button>
              <Button
                variant={orderType === ORDER_TYPE.TOGOBOX ? "solid" : "outline"}
                onClick={() => setOrderType(ORDER_TYPE.TOGOBOX)}
              >
                + TOGO Box
              </Button>
              <Button
                variant={
                  orderType === ORDER_TYPE.CURBSIDE ? "solid" : "outline"
                }
                onClick={() => setOrderType(ORDER_TYPE.CURBSIDE)}
              >
                Curbside
              </Button>
            </ButtonGroup>
            <Text fontSize="xl" fontWeight="700" color="gray.600" mt="8" mb="2">
              Order Preferences
            </Text>
            <Flex
              w="100%"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
            >
              {renderPreferences()}
            </Flex>
            <Flex
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              mt="8"
            >
              <Text fontSize="xl" fontWeight="700" color="gray.600">
                Total
              </Text>
              <Divider orientation="horizontal" w="100%" mx="4" />
              <Text fontSize="xl" fontWeight="700" color="gray.600">
                {`$${getCurrentOrderPrice(order, foods, orderType, boxNum)}`}
              </Text>
            </Flex>
            <Text fontSize="xs" fontWeight="500" color="gray.400" mt="2">
              Taxes and fees will be calculated after the order is placed.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              isDisabled={!isOrderable()}
              isLoading={isOrdering}
              onClick={() => handleOrder()}
            >
              Place Order
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

PlaceOrderModal.defaultProps = {};

PlaceOrderModal.propTypes = {
  shopData: Proptypes.object.isRequired,
  foods: Proptypes.array.isRequired,
  order: Proptypes.object.isRequired,
  isOpen: Proptypes.bool.isRequired,
  onClose: Proptypes.func.isRequired,
};

export default PlaceOrderModal;
