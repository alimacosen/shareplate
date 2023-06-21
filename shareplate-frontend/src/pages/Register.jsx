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
import { useNavigate } from "react-router-dom";
import EmailPasswordFields from "../components/EmailPasswordField";
import { FaUserPlus } from "react-icons/fa";
import { customerRegister } from "../api/customers";
import { shopRegister } from "../api/shops";

function Register() {
  React.useEffect(() => {
    if (localStorage.getItem("SHAREPLATE_TOKEN")) {
      navigate("/");
    }
  });
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  let res;
  const handleRegister = async (type) => {
    try {
      switch (type) {
        case "customer":
          res = await customerRegister(email, password);
          break;
        case "shop":
          res = await shopRegister(email, password);
          break;
      }
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: `We were unable to create your account.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (res.status == 200) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/login/${type}`);
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
      <Icon as={FaUserPlus} color="green.500" boxSize="10" />
      <Text fontSize="3xl" fontWeight="700" color="green.500" mb="4">
        Register
      </Text>
      <EmailPasswordFields setEmail={setEmail} setPassword={setPassword} />
      <HStack my="2">
        <Text fontSize="sm" fontWeight="600" color="gray.500">
          Already have an account?
        </Text>
        <Link
          fontWeight="800"
          fontSize="sm"
          color="green.600"
          onClick={() => navigate("/")}
        >
          Login
        </Link>
      </HStack>
      <Text fontSize="sm" fontWeight="600" color="gray.500" mt="8">
        Register as:
      </Text>
      <HStack w="80%" my="2">
        <Button
          colorScheme="green"
          size="lg"
          w="100%"
          onClick={async () => await handleRegister("customer")}
        >
          Customer
        </Button>
        <Button
          colorScheme="green"
          size="lg"
          w="100%"
          variant="outline"
          onClick={async () => await handleRegister("shop")}
        >
          Shop
        </Button>
      </HStack>
    </Flex>
  );
}

export default Register;
