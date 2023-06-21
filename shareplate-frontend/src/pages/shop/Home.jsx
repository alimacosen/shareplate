import {
  Flex,
  Text,
  Link,
  HStack,
  Box,
  Switch,
  useToast,
} from "@chakra-ui/react";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import HomeUserCard from "../../components/HomeUserCard";
import { useNavigate } from "react-router-dom";
import { useUser, useOrders } from "../../api/swr";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import { USER_TYPE } from "../../enum";
import HomeFoodCard from "../../components/HomeFoodCard";
import HomeOrderCard from "../../components/HomeOrderCard";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import ShopStatusBadge from "../../components/ShopStatusBadge";
import { patchShopData } from "../../api/shops";

function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, mutate, isError, isLoading } = useUser(USER_TYPE.SHOP);
  const { orders, isOrderError, isOrderLoading } = useOrders(USER_TYPE.SHOP);
  if (isError || isOrderError)
    ErrorHandler("Error fetching shop data.", "/login/shop");
  if (isLoading || isOrderLoading || !orders) return <Loading />;
  const handleShopToggle = async (e) => {
    try {
      const resp = await patchShopData(user.data._id, {
        available: e.target.checked,
      });
      if (resp.status === 200) {
        toast({
          title: "Shop is now " + (e.target.checked ? "open" : "closed") + ".",
          description: "Your shop status has been updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error updating shop status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <HeaderBar userType={USER_TYPE.SHOP} />
      <Box bg="white" w="100%" pt="64px" px="6">
        <Text fontSize="3xl" fontWeight="700" color="green.500" my="2" ml="0.5">
          Welcome back 👋
        </Text>
        <HStack spacing="2" mb="4">
          <ShopStatusBadge
            status={false}
            fontSize="md"
            opacity={user.data.available ? 0.3 : 1}
          />
          <Switch
            size="lg"
            colorScheme="green"
            defaultChecked={user.data.available}
            onChange={handleShopToggle}
          />
          <ShopStatusBadge
            status={true}
            fontSize="md"
            opacity={user.data.available ? 1 : 0.3}
          />
        </HStack>
        <HomeUserCard user={user.data} />
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <HStack spacing="2">
            <Text fontSize="xl" fontWeight="700" color="gray.600">
              My Foods
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
          {user.data.menu?.map((food) => {
            return (
              <HomeFoodCard
                food={food}
                key={`home-food-card-${food._id}`}
                mr="4"
                my="2"
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
        <ScrollMenu>
          {orders?.orders?.map((order) => {
            return (
              <HomeOrderCard
                order={order}
                userType={USER_TYPE.SHOP}
                key={`home-order-card-${order._id}`}
              />
            );
          })}
        </ScrollMenu>
      </Box>
      <Footer />
    </>
  );
}

export default Home;
