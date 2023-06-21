import { Flex, Text, Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <Flex
      w="100vw"
      h="80vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Spinner size="xl" color="green.500" />
      <Text fontSize="2xl" fontWeight="700" color="gray.600" mt="4">
        Loading...
      </Text>
    </Flex>
  );
}

export default Loading;
