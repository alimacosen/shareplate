import { Flex, Text, Tag, TagLabel, Image } from "@chakra-ui/react";
import "react-horizontal-scrolling-menu/dist/styles.css";
import propTypes from "prop-types";
import sharePlateCover from "../images/shareplate_cover.png";

function HomeFoodCard({ food, w, h, ...props }) {
  return (
    <Flex
      w={w || "300px"}
      h={h || "48"}
      bg="white"
      justifyContent="space-between"
      alignItems="start"
      flexDirection="column"
      rounded="lg"
      shadow="md"
      {...props}
    >
      <Image
        w="100%"
        h="60%"
        src={food.image}
        fallbackSrc={sharePlateCover}
        borderTopRadius="lg"
        objectFit="cover"
      />
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        py="4"
        px="4"
      >
        <Flex
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
          w="100%"
        >
          <Flex w="100%" alignItems="center" justifyContent="start">
            <Text fontSize="lg" fontWeight="700" color="gray.600">
              {food.foodName}
            </Text>
            <Tag
              w="max-content"
              size="md"
              rounded="full"
              colorScheme="green"
              variant="solid"
              fontWeight="600"
              ml="2"
            >
              <TagLabel>{food.quantity} left</TagLabel>
            </Tag>
          </Flex>
          <Text fontSize="xs" fontWeight="500" color="gray.500">
            {food.description}
          </Text>
        </Flex>
        <Text fontSize="2xl" fontWeight="600" color="gray.600">
          ${food.price.toFixed(2)}
        </Text>
      </Flex>
    </Flex>
  );
}

HomeFoodCard.defaultProps = {};

HomeFoodCard.propTypes = {
  food: propTypes.object.isRequired,
  // userType: propTypes.number,
  w: propTypes.string,
  h: propTypes.string,
};

export default HomeFoodCard;
