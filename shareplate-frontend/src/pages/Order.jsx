import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import { getAccountTypeByToken } from "../utils";
import { Flex, Box, Text } from "@chakra-ui/react";
import OrderCard from "../components/OrderCard";
import ListEndText from "../components/ListEndText";
import { useOrders } from "../api/swr";
import ErrorHandler from "./ErrorHandler";
import Loading from "./Loading";
function Order() {
  const { orders, isError, isLoading, mutate } = useOrders(
    getAccountTypeByToken(localStorage.getItem("SHAREPLATE_TOKEN"))
  );
  if (isError) ErrorHandler("Error fetching order data.", "/");
  if (isLoading) return <Loading />;
  const orderData = orders.orders;
  return (
    <>
      <HeaderBar
        userType={getAccountTypeByToken(
          localStorage.getItem("SHAREPLATE_TOKEN")
        )}
      />
      <Box bg="white" w="100%" pt="64px" px="6" minH="85vh">
        <Box w="100%" position="sticky" top="64px" zIndex="1" bg="white" py="4">
          <Text
            fontSize="3xl"
            fontWeight="700"
            textAlign="start"
            color="green.500"
          >
            Order Management
          </Text>
        </Box>
        <Flex flexDirection="column" overflow="scroll">
          {orderData.map((order, index) => (
            <OrderCard
              order={order}
              key={"order-card-" + index}
              userType={getAccountTypeByToken(
                localStorage.getItem("SHAREPLATE_TOKEN")
              )}
              mutateOrders={mutate}
            />
          ))}
          <ListEndText />
        </Flex>
      </Box>
      <Footer />
    </>
  );
}

Order.defaultProps = {};
Order.propTypes = {};

export default Order;
