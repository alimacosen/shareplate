import { Flex, Icon, Text } from "@chakra-ui/react";
import { FaRegDizzy } from "react-icons/fa";
import PropTypes from "prop-types";

function NoResultPlaceholder({ text, ...props }) {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      w="100%"
      h="100%"
      {...props}
    >
      <Icon as={FaRegDizzy} boxSize="10" color="gray.400" mb="2" />
      <Text fontSize="lg" fontWeight="600" color="gray.400">
        {text}
      </Text>
    </Flex>
  );
}

NoResultPlaceholder.defaultProps = {
  text: "No Result",
};

NoResultPlaceholder.propTypes = {
  text: PropTypes.string,
};

export default NoResultPlaceholder;
