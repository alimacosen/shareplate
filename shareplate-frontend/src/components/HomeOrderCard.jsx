import { Flex, Text, Icon, HStack, Skeleton } from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import { calcOrderQuantity } from "../utils";
import OrderStatusBadge from "./OrderStatusBadge";
import { getDatetimeString } from "../datetime";
import { USER_TYPE, invertUserType } from "../enum";
import { useUser } from "../api/swr";
import ErrorHandler from "../pages/ErrorHandler";
function HomeOrderCard({ order, userType }) {
  const navigate = useNavigate();
  const { user, isLoading, isError } = useUser(
    invertUserType(userType),
    userType === USER_TYPE.CUSTOMER ? order.shopId : order.userId
  );
  if (isError) ErrorHandler("Error fetching order metadata", "/", false);
  return (
    <Flex
      w="256px"
      h="28"
      bg="white"
      justifyContent="space-between"
      alignItems="start"
      flexDirection="column"
      rounded="lg"
      shadow="md"
      mr="4"
      my="2"
      px="6"
      py="4"
      onClick={() => navigate("/orders/" + order._id)}
    >
      <Flex w="100%" justifyContent="start" alignItems="center">
        <Icon as={FaClipboardList} boxSize="6" color="gray.500" mr="2" />
        <Flex flexDirection="column" justifyContent="start" alignItems="start">
          <HStack spacing="2">
            <OrderStatusBadge status={order.status} />
          </HStack>
          <Skeleton isLoaded={!isLoading}>
            <Text fontSize="md" fontWeight="700" color="gray.600">
              {isLoading ? "Loading..." : user.data.name}
            </Text>
          </Skeleton>
        </Flex>
      </Flex>
      <Flex flexDirection="column" justifyContent="start" alignItems="start">
        <Text fontSize="sm" fontWeight="600" color="gray.500">
          {calcOrderQuantity(order) + " items · $" + order.price.toFixed(2)}
        </Text>
        <Text fontSize="xs" fontWeight="500" color="gray.500">
          {getDatetimeString(order.createdTime, true)}
        </Text>
      </Flex>
    </Flex>
  );
}

HomeOrderCard.defaultProps = {};

HomeOrderCard.propTypes = {
  order: propTypes.object.isRequired,
  userType: propTypes.number.isRequired,
};

export default HomeOrderCard;
