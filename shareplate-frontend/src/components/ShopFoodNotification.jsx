import PropTypes from "prop-types";
import { Flex, Icon, Button, Text } from "@chakra-ui/react";
import { FaUtensils } from "react-icons/fa";
function ShopFoodNotification({ shop }) {
  return (
    <Flex
      px="4"
      py="2"
      w="90vw"
      flexDirection="row"
      justifyContent="start"
      alignItems="center"
      color="gray.700"
      bg="green.50"
      rounded="md"
      shadow="md"
      borderTop="4px solid"
      borderColor="green.500"
    >
      <Icon as={FaUtensils} mr={4} boxSize="6" />
      <Flex w="100%" flexDirection="column">
        <Text fontWeight="700" fontSize="lg">
          {`Subscribed shop update!`}
        </Text>
        <Text fontWeight="500" fontSize="sm" color="gray.600">
          {`${shop.name} has updated their menu. Check it out!`}
        </Text>
      </Flex>
      <Button
        size="sm"
        fontSize="md"
        fontWeight="600"
        colorScheme="green"
        ml="auto"
        variant="ghost"
        onClick={() => {
          window.location.href = `/shops/${shop._id}`;
        }}
      >
        View
      </Button>
    </Flex>
  );
}

ShopFoodNotification.propTypes = {
  shop: PropTypes.object.isRequired,
};

export default ShopFoodNotification;
