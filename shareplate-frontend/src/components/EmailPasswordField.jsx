import React from "react";
import {
  Flex,
  Input,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { FaEnvelope, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import PropType from "prop-types";

function EmailPasswordFields({ setEmail, setPassword }) {
  const [showPass, setShowPass] = React.useState(false);
  const handleShowPass = () => setShowPass(!showPass);
  return (
    <Flex
      px="8"
      py="4"
      rounded="lg"
      border={"1px"}
      borderColor="gray.300"
      flexDirection="column"
    >
      <HStack my="1">
        <Icon as={FaEnvelope} color="gray.400" boxSize="6" mr="2" />
        <Input
          placeholder="Email"
          type="email"
          variant="flushed"
          focusBorderColor="green.500"
          onChange={(e) => setEmail(e.target.value)}
        />
      </HStack>
      <HStack my="1">
        <Icon as={FaKey} color="gray.400" boxSize="6" mr="2" />
        <InputGroup>
          <Input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            variant="flushed"
            focusBorderColor="green.500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button size="sm" colorScheme="gray" variant="none">
              <Icon
                as={showPass ? FaEye : FaEyeSlash}
                color="gray.400"
                boxSize="6"
                onClick={handleShowPass}
              />
            </Button>
          </InputRightElement>
        </InputGroup>
      </HStack>
    </Flex>
  );
}

EmailPasswordFields.defaultProps = {};

EmailPasswordFields.propTypes = {
  setEmail: PropType.func.isRequired,
  setPassword: PropType.func.isRequired,
};

export default EmailPasswordFields;
