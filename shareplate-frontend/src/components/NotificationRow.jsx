import { Flex, Text, Icon } from "@chakra-ui/react";
import { FaHamburger } from "react-icons/fa";
import { getDatetimeString } from "../datetime";
import PropTypes from "prop-types";

function NotificationRow({ notification }) {
  return (
    <Flex
      w="100%"
      h="128px"
      px="4"
      py="2"
      bg="white"
      justifyContent="start"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Icon as={FaHamburger} boxSize="8" color="green.500" mr="4" />
      <Flex flexDirection="column" justifyContent="start" alignItems="start">
        <Text fontSize="xs" fontWeight="500" color="gray.500">
          {getDatetimeString(notification.timestamp)}
        </Text>
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Text fontSize="lg" fontWeight="700" color="green.500">
            {notification.title}
          </Text>
          <Text fontSize="sm" fontWeight="600" color="gray.500">
            {notification.shop}
          </Text>
        </Flex>
        <Text fontSize="sm" fontWeight="500" color="gray.500">
          {notification.description}
        </Text>
      </Flex>
    </Flex>
  );
}

NotificationRow.defaultProps = {};

NotificationRow.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationRow;
