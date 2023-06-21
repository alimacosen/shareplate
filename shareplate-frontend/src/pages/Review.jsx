import { Flex, Text, HStack, Box, Image, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useUser } from "../api/swr";
import Loading from "./Loading";
import ErrorHandler from "./ErrorHandler";
import { USER_TYPE } from "../enum";
import "react-horizontal-scrolling-menu/dist/styles.css";
import sharePlateCover from "../images/shareplate_cover.png";
import UserTypeTag from "../components/UserTypeTag";
import { calcAvgRating, getAccountTypeByToken } from "../utils";
import { getDatetimeString } from "../datetime";
import ListEndText from "../components/ListEndText";

function Review() {
  const { id, type } = useParams();
  let accountType = USER_TYPE.CUSTOMER;
  if (type) {
    accountType = type === "customers" ? USER_TYPE.CUSTOMER : USER_TYPE.SHOP;
  } else {
    accountType = getAccountTypeByToken(
      localStorage.getItem("SHAREPLATE_TOKEN")
    );
  }
  const { user, isError, isLoading } = useUser(accountType, id);
  if (isError) ErrorHandler("Error fetching review data.", "/");
  if (isLoading) return <Loading />;
  const reviews = user.data.reviews;
  return (
    <>
      <HeaderBar
        userType={getAccountTypeByToken(
          localStorage.getItem("SHAREPLATE_TOKEN")
        )}
      />
      <Box bg="white" w="100%" pt="64px" px="6" minH="85vh">
        <Box w="100%" position="sticky" top="64px" zIndex="1" bg="white" pb="4">
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="green.500"
            my="2"
            ml="0.5"
          >
            Reviews
          </Text>
          <Flex w="100%" justifyContent="start" alignItems="center">
            <Image
              src={user.data.image}
              fallbackSrc={sharePlateCover}
              alt="User"
              h="16"
              w="16"
              mr="4"
              objectFit="cover"
            />
            <Flex flexDirection="column">
              <HStack spacing="4" flexWrap="wrap">
                <Text fontSize="2xl" fontWeight="700" color="gray.600">
                  {user.data.name}
                </Text>
                <UserTypeTag type={user.data.type || accountType} size="md" />
              </HStack>
              <HStack spacing="1">
                <Icon as={FaStar} color="green.500" boxSize="4" />
                <Text fontSize="md" fontWeight="600" color="gray.600">
                  Average Rating: {calcAvgRating(user.data.reviews)}
                </Text>
              </HStack>
            </Flex>
          </Flex>
        </Box>
        <Box>
          {reviews.map((review, index) => (
            <Box
              key={"review_" + review.id + "_" + index}
              borderWidth="1px"
              borderRadius="lg"
              p="4"
              my="4"
            >
              <Flex justifyContent="space-between">
                <Text fontSize="lg" fontWeight="600" color="gray.600">
                  {review.reviewer.name}
                </Text>
                <HStack spacing="1">
                  <Icon as={FaStar} color="green.500" boxSize="4" />
                  <Text fontSize="md" fontWeight="600" color="gray.600">
                    {review.rating}
                  </Text>
                </HStack>
              </Flex>
              <Text fontSize="md" color="gray.600" my="2">
                {review.content}
              </Text>
              <Text fontSize="sm" color="gray.400">
                {getDatetimeString(review.createdTime, true)}
              </Text>
            </Box>
          ))}
          <ListEndText />
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Review;
