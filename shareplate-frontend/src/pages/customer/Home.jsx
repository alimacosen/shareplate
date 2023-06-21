import { Flex, Text, Link, HStack, Box } from "@chakra-ui/react";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import HomeUserCard from "../../components/HomeUserCard";
import { useNavigate } from "react-router-dom";
import { useShops, useUser, useOrders } from "../../api/swr";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import { USER_TYPE } from "../../enum";
import HomeOrderCard from "../../components/HomeOrderCard";
import HomeShopCard from "../../components/HomeShopCard";
import NoResultPlaceholder from "../../components/NoResultPlaceholder";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

function Home() {
  const navigate = useNavigate();
  const { user, isError, isLoading } = useUser(USER_TYPE.CUSTOMER);
  const {
    orders,
    isLoading: orderLoading,
    isError: orderError,
  } = useOrders(USER_TYPE.CUSTOMER);
  const { shopList, isLoading: shopLoading, isError: shopError } = useShops();
  if (isError || shopError || orderError)
    ErrorHandler("Error fetching customer data.", "/login/customer");
  if (isLoading || shopLoading || orderLoading) return <Loading />;
  const orderData = orders.orders;
  const shopData = shopList.data;
  return (
    <>
      <HeaderBar userType={USER_TYPE.CUSTOMER} />
      <Box bg="white" w="100%" pt="64px" px="6">
        <Text fontSize="3xl" fontWeight="700" color="green.500" my="2" ml="0.5">
          Welcome back 👋
        </Text>
        <HomeUserCard user={user.data} />
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <HStack spacing="2">
            <Text fontSize="xl" fontWeight="700" color="gray.600">
              Shop Collections
            </Text>
          </HStack>
          <Link
            fontWeight="800"
            fontSize="sm"
            color="green.500"
            onClick={() => navigate("/shops")}
          >
            View All
          </Link>
        </Flex>
        <ScrollMenu>
          {shopData.map((shop) => {
            return (
              <HomeShopCard
                mr="4"
                my="2"
                shop={shop}
                key={`home-shop-card-${shop._id}`}
              />
            );
          })}
        </ScrollMenu>
        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          mt="4"
        >
          <HStack spacing="2">
            <Text fontSize="xl" fontWeight="700" color="gray.600">
              Recent Orders
            </Text>
          </HStack>
          <Link
            fontWeight="800"
            fontSize="sm"
            color="green.500"
            onClick={() => navigate("/orders")}
          >
            View All
          </Link>
        </Flex>
        {orderData.length > 0 ? (
          <ScrollMenu>
            {orderData.map((order) => {
              return (
                <HomeOrderCard
                  order={order}
                  userType={USER_TYPE.CUSTOMER}
                  key={`home-order-card-${order._id}`}
                />
              );
            })}
          </ScrollMenu>
        ) : (
          <NoResultPlaceholder my="8" />
        )}
      </Box>
      <Footer />
    </>
  );
}

export default Home;
