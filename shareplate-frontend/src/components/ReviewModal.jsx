import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Proptypes from "prop-types";
import { getDatetimeString } from "../datetime";
import { useState } from "react";
import { ORDER_STATUS, USER_TYPE } from "../enum";
import { postReview } from "../api/review";
function ReviewModal({
  order,
  subjectData,
  userType,
  subjectDataIsLoading,
  mutateOrders,
  ...btnProps
}) {
  const ratingNumbers = [1, 2, 3, 4, 5];
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState(3);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRatable = (order) => {
    if (order.status != ORDER_STATUS.COMPLETED) return false;
    if (userType == USER_TYPE.CUSTOMER) {
      return order.linkedReviews.fromCustomer == null;
    }
    if (userType == USER_TYPE.SHOP) {
      return order.linkedReviews.fromShop == null;
    }
  };

  const handleSubmit = async () => {
    const revieweeId = subjectData._id;
    const payload = {
      rating,
      content,
      orderId: order._id,
    };
    setIsSubmitting(true);
    const resp = await postReview(userType, revieweeId, payload);
    if (resp.status === 200) {
      toast({
        title: "Review submitted",
        description: "Your review has been submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      mutateOrders();
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };
  if (subjectDataIsLoading)
    return (
      <Button {...btnProps} colorScheme="green" isLoading>
        Rate
      </Button>
    );

  return (
    <>
      <Button
        {...btnProps}
        colorScheme="green"
        onClick={onOpen}
        isDisabled={!isRatable(order)}
      >
        Rate
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {"Rate your order with " + subjectData.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="xl" fontWeight="700" color="gray.600">
              Details
            </Text>
            <Text fontSize="sm" fontWeight="700" color="gray.500">
              {"Order ID: " + order._id}
            </Text>
            <Text fontSize="sm" fontWeight="700" color="gray.500">
              {"Order Date: " + getDatetimeString(order.createdTime, true)}
            </Text>
            <Text fontSize="xl" fontWeight="700" color="gray.600" mt="8">
              Rating
            </Text>
            <Slider
              defaultValue={rating}
              min={1}
              max={5}
              step={1}
              mx="4"
              my="8"
              onChange={(value) => {
                setRating(value);
              }}
              w="90%"
            >
              {ratingNumbers.map((number) => {
                return (
                  <SliderMark
                    value={number}
                    mt="4"
                    ml="-1"
                    key={"slider-mark-" + number}
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="700"
                      color={rating == number ? "green.500" : "gray.300"}
                    >
                      {number}
                    </Text>
                  </SliderMark>
                );
              })}
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="green.500" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
            <Text fontSize="xl" fontWeight="700" color="gray.600" mt="8">
              Comment
            </Text>
            <Textarea
              h="160px"
              resize={"none"}
              placeholder="Leave a comment"
              mt="4"
              focusBorderColor="green.500"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              variant="ghost"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              isDisabled={content === ""}
              onClick={() => handleSubmit()}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

ReviewModal.defaultProps = {};

ReviewModal.propTypes = {
  order: Proptypes.object.isRequired,
  subjectData: Proptypes.object.isRequired,
  userType: Proptypes.number.isRequired,
  subjectDataIsLoading: Proptypes.bool.isRequired,
  mutateOrders: Proptypes.func.isRequired,
};

export default ReviewModal;
