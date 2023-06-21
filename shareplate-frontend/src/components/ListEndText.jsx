import { Text, HStack } from "@chakra-ui/react";
import { FaRegGrinBeamSweat } from "react-icons/fa";

function ListEndText() {
  return (
    <HStack spacing="2" w="100%" justifyContent="center" my="10">
      <Text fontSize="xl" fontWeight="600" color="gray.500">
        <FaRegGrinBeamSweat />
      </Text>
      <Text fontSize="lg" fontWeight="700" color="gray.500">
        That's all!
      </Text>
    </HStack>
  );
}

ListEndText.defultProps = {};
ListEndText.propTypes = {};

export default ListEndText;
