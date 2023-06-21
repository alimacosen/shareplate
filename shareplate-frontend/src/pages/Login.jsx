import React from "react";
import {
  Flex,
  Text,
  Icon,
  HStack,
  Link,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import EmailPasswordFields from "../components/EmailPasswordField";
import { GiFoodTruck } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import { shopLogin } from "../api/shops";
import { customerLogin } from "../api/customers";
import { socket } from "../socket";

function Login() {
  React.useEffect(() => {
    if (localStorage.getItem("SHAREPLATE_TOKEN")) {
      navigate("/");
    }
  });
  const navigate = useNavigate();
  const { type } = useParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();
  const isShop = type == "shop";
  const handleLogin = async () => {
    setIsLoading(true);
    let res;
    try {
      if (isShop) {
        // shop login
        res = await shopLogin(email, password);
      } else {
        // customer login
        res = await customerLogin(email, password);
      }
    } catch (err) {
      // error
      toast({
        title: "An error occurred.",
        description: `We were unable to log you in.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
    if (res.status == 200) {
      // success
      const { id, token } = res.data.data;
      localStorage.setItem("SHAREPLATE_TOKEN", token);
      localStorage.setItem("SHAREPLATE_ID", id);
      socket.connect();
      setIsLoading(false);
      navigate("/");
      window.location.reload();
    }
  };
  return (
    <Flex
      bg="white"
      h="80vh"
      w="100vw"
      pt="64px"
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Icon
        as={isShop ? GiFoodTruck : FaUserFriends}
        color="green.500"
        boxSize="10"
      />
      <Text fontSize="3xl" fontWeight="700" color="green.500" mb="4">
        {isShop ? "Shop Login" : "Customer Login"}
      </Text>
      <EmailPasswordFields setEmail={setEmail} setPassword={setPassword} />
      <HStack my="2">
        <Text fontSize="sm" fontWeight="600" color="gray.500">
          Not a {isShop ? "shop" : "customer"}?
        </Text>
        <Link
          fontWeight="800"
          fontSize="sm"
          color="green.600"
          onClick={() => navigate(isShop ? "/login/customer" : "/login/shop")}
        >
          {isShop ? "Customer Login" : "Shop Login"}
        </Link>
      </HStack>
      <Button
        colorScheme="green"
        size="lg"
        w="80%"
        my="4"
        onClick={async () => await handleLogin()}
        isLoading={isLoading}
        loadingText="Logging in..."
      >
        Login
      </Button>
    </Flex>
  );
}

export default Login;
