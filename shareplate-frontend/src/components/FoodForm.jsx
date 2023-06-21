import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

function FoodForm({ initialValues, onSubmit }) {
  const foodNameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFood = {
      foodName: foodNameRef.current.value,
      price: priceRef.current.value,
      quantity: quantityRef.current.value,
      description: descriptionRef.current.value,
      image: imageRef.current.value,
    };

    onSubmit(newFood);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex flexDirection="column" mb="8">
        <FormControl id="foodName">
          <FormLabel>Food Name</FormLabel>
          <Input
            ref={foodNameRef}
            defaultValue={initialValues.foodName}
            focusBorderColor="green.500"
          />
        </FormControl>
        <FormControl id="price" mt="4">
          <FormLabel>Price</FormLabel>
          <Input
            ref={priceRef}
            defaultValue={initialValues.price}
            focusBorderColor="green.500"
          />
        </FormControl>
        <FormControl id="quantity" mt="4">
          <FormLabel>Quantity</FormLabel>
          <Input
            ref={quantityRef}
            defaultValue={initialValues.quantity}
            focusBorderColor="green.500"
          />
        </FormControl>
        <FormControl id="description" mt="4">
          <FormLabel>Description</FormLabel>
          <Input
            ref={descriptionRef}
            defaultValue={initialValues.description}
            focusBorderColor="green.500"
          />
        </FormControl>
        <FormControl id="description" mt="4">
          <FormLabel>Image URL</FormLabel>
          <Input
            ref={imageRef}
            defaultValue={initialValues.image}
            focusBorderColor="green.500"
          />
        </FormControl>
        <Button type="submit" colorScheme="green" w="100%" mt="10">
          Save
        </Button>
      </Flex>
    </form>
  );
}

FoodForm.propTypes = {
  initialValues: PropTypes.shape({
    foodName: PropTypes.string,
    price: PropTypes.string,
    quantity: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default FoodForm;
