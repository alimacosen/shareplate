import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
function Footer() {
  return (
    <Flex
      h="48px"
      w="100%"
      bg="white"
      justifyContent="space-between"
      alignItems="center"
      px="4"
    >
      <Text fontSize="sm" fontWeight="600" color="gray.500">
        SharePlate - Team 2
      </Text>
      <Button size="sm" colorScheme="gray" variant="ghost">
        <Icon as={FaGithub} color="gray.500" boxSize="5" />
      </Button>
    </Flex>
  );
}

export default Footer;
