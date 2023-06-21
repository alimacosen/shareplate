import PropTypes from "prop-types";
import { Flex, HStack, Icon, Button, Text } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { calcOrderQuantity } from "../utils";
import OrderStatusBadge from "./OrderStatusBadge";
import { ORDER_STATUS_MAP } from "../mapping";
function OrderStatusNotification({ order }) {
  return (
    <Flex
      px="4"
      py="2"
      w="90vw"
      flexDirection="row"
      justifyContent="start"
      alignItems="center"
      color="gray.700"
      bg="green.50"
      rounded="md"
      shadow="md"
      borderTop="4px solid"
      borderColor="green.500"
    >
      <Icon as={FaBell} mr={4} boxSize="6" />
      <Flex w="100%" flexDirection="column">
        <Text fontWeight="700" fontSize="lg">
          {`Your order is ${ORDER_STATUS_MAP[order.status].toLowerCase()}`}
        </Text>
        <HStack spacing="2">
          <Text fontWeight="500">{`${order.shopId.name}`}</Text>
          <OrderStatusBadge status={order.status} />
        </HStack>
        <Text
          fontSize="sm"
          fontWeight="500"
          color="gray.500"
        >{`${calcOrderQuantity(order)} items · $${order.price.toFixed(
          2
        )}`}</Text>
      </Flex>
      <Button
        size="sm"
        fontSize="md"
        fontWeight="600"
        colorScheme="green"
        ml="auto"
        variant="ghost"
        onClick={() => {
          window.location.href = `/orders/${order._id}`;
        }}
      >
        View
      </Button>
    </Flex>
  );
}

OrderStatusNotification.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderStatusNotification;
