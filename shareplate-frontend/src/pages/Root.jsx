import { Flex, Text, Image, Button, HStack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import sharePlateLogo from "../images/shareplate.png";

function Root() {
  const navigate = useNavigate();
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
      <Text fontSize="md" fontWeight="700" color="green.600" mb="4">
        Less waste, more taste, share the plate!
      </Text>
      <Image src={sharePlateLogo} alt="SharePlate" h="16" w="auto" mb="10" />
      <Button
        colorScheme="green"
        size="lg"
        w="80%"
        my="1"
        onClick={() => navigate("/login/customer")}
      >
        Customer Login
      </Button>
      <Button
        colorScheme="green"
        size="lg"
        w="80%"
        my="1"
        variant="outline"
        onClick={() => navigate("/login/shop")}
      >
        Shop Login
      </Button>
      <HStack my="2">
        <Text fontSize="sm" fontWeight="600" color="gray.500">
          New to SharePlate?
        </Text>
        <Link
          fontWeight="800"
          fontSize="sm"
          color="green.600"
          onClick={() => navigate("/register")}
        >
          Register
        </Link>
      </HStack>
    </Flex>
  );
}

export default Root;
