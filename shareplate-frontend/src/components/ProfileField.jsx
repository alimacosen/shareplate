import React from "react";
import { Flex, Input, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

function ProfileField({
  label,
  placeholder,
  fieldKey,
  newProfile,
  setNewProfile,
  ...props
}) {
  const handleProfileChange = (e, key) => {
    setNewProfile({ ...newProfile, [key]: e.target.value });
  };
  return (
    <Flex w="100%" my="2" flexDirection="column">
      <Flex justifyContent="start" alignItems="center">
        <Text fontSize="sm" fontWeight="600" color="gray.600">
          {label}
        </Text>
      </Flex>
      <Input
        size="lg"
        variant="flushed"
        value={newProfile[fieldKey] || ""}
        focusBorderColor="green.500"
        placeholder={placeholder}
        onChange={(e) => handleProfileChange(e, fieldKey)}
        autocomplete="new-password"
        {...props}
      />
    </Flex>
  );
}

ProfileField.defaultProps = {};

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldKey: PropTypes.string.isRequired,
  newProfile: PropTypes.object.isRequired,
  setNewProfile: PropTypes.func.isRequired,
};

export default ProfileField;
