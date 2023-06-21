import { Flex, Text, Icon, Button } from "@chakra-ui/react";
import { FaArrowLeft, FaRegDizzy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <Flex
      w="100vw"
      h="80vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Icon as={FaRegDizzy} boxSize="16" color="gray.500" />
      <Text fontSize="3xl" fontWeight="700" color="gray.500" my="2">
        404 Not Found
      </Text>
      <Button
        leftIcon={<FaArrowLeft />}
        colorScheme="green"
        variant="solid"
        onClick={() => navigate("/")}
      >
        Go Back to Home
      </Button>
    </Flex>
  );
}

export default NotFound;
