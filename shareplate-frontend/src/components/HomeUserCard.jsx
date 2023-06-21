import { Flex, Text, Button, HStack, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { calcAvgRating } from "../utils";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import UserTypeTag from "./UserTypeTag";

function HomeUserCard({ user }) {
  const navigate = useNavigate();
  return (
    <Flex
      w="100%"
      justifyContent="center"
      alignItems="start"
      flexDirection="column"
      bg="green.400"
      rounded="lg"
      mb="4"
      px="8"
      py="4"
      shadow="xl"
    >
      <HStack spacing="4">
        <Text fontSize="xl" fontWeight="700" color="white">
          {user.name}
        </Text>
        <UserTypeTag type={user.type} />
      </HStack>
      <Flex justifyContent="space-between" alignItems="center" w="100%" mt="2">
        <Flex justifyContent="start" flexDirection="column">
          <HStack spacing="1">
            <Icon as={FaStar} color="white" boxSize="3" />
            <Text fontSize="sm" fontWeight="600" color="white">
              Average Rating: {calcAvgRating(user.reviews)}
            </Text>
          </HStack>
          <Text fontSize="xs" fontWeight="600" color="green.100" ml="4">
            You got {user.reviews.length} reviews.
          </Text>
        </Flex>
        <Button
          variant="solid"
          colorScheme="green"
          size="sm"
          onClick={() => navigate("/reviews")}
        >
          All Reviews
        </Button>
      </Flex>
    </Flex>
  );
}

HomeUserCard.defualtProps = {};

HomeUserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default HomeUserCard;
