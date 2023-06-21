import {
  Flex,
  Text,
  Icon,
  HStack,
  Tag,
  TagLabel,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { calcAvgRating } from "../utils";
import { SHOP_TYPE_MAP } from "../mapping";
import ShopStatusBadge from "../components/ShopStatusBadge";
import propTypes from "prop-types";
import sharePlateCover from "../images/shareplate_cover.png";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
function HomeShopCard({ shop, w, h, ...props }) {
  const navigate = useNavigate();
  return (
    <Flex
      w={w || "350px"}
      h={h || "60"}
      bg="white"
      justifyContent="space-between"
      alignItems="start"
      flexDirection="column"
      rounded="lg"
      shadow="md"
      onClick={() => navigate("/shops/" + shop._id)}
      {...props}
    >
      <Image
        w="100%"
        h="60%"
        src={shop.image}
        fallbackSrc={sharePlateCover}
        borderTopRadius="lg"
        objectFit="cover"
        filter={shop.available ? "" : "grayscale(100%)"}
      />
      <Flex
        flexDirection="column"
        justifyContent="start"
        alignItems="start"
        w="100%"
        h="40%"
        py="2"
        px="4"
      >
        <Flex w="100%" alignItems="center" justifyContent="start">
          <Text fontSize="lg" fontWeight="700" color="gray.600">
            {shop.name}
          </Text>
          <HStack spacing="1" ml="2">
            <Icon as={FaStar} boxSize="3" color="gray.500" />
            <Text fontSize="xs" fontWeight="700" color="gray.500">
              {calcAvgRating(shop.reviews)}
            </Text>
          </HStack>
          <ShopStatusBadge status={shop.available} ml="auto" fontSize="sm" />
        </Flex>
        <Text fontSize="xs" fontWeight="500" color="gray.500">
          {shop.description || "No description provided."}
        </Text>
        <Flex
          w="280px"
          justifyContent="start"
          alignItems="center"
          mt="2"
          overflow="scroll"
        >
          <ScrollMenu>
            {shop.shopType.map((shopType) => {
              return (
                <Tag
                  w="max-content"
                  size="sm"
                  rounded="full"
                  key={shopType}
                  colorScheme="green"
                  variant="solid"
                  fontWeight="600"
                  mr="1"
                >
                  <TagLabel>{SHOP_TYPE_MAP[shopType]}</TagLabel>
                </Tag>
              );
            })}
          </ScrollMenu>
        </Flex>
      </Flex>
    </Flex>
  );
}

HomeShopCard.defaultProps = {};

HomeShopCard.propTypes = {
  shop: propTypes.object.isRequired,
  w: propTypes.string,
  h: propTypes.string,
};

export default HomeShopCard;
