import React from "react";
import { Flex, Text, Button, HStack, useToast } from "@chakra-ui/react";
import { useUser } from "../../api/swr";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import { patchCustomerData } from "../../api/customers";
import { USER_TYPE } from "../../enum";
import ProfileField from "../../components/ProfileField";

function Profile() {
  const toast = useToast();
  const { user, mutate, isError, isLoading } = useUser(USER_TYPE.CUSTOMER);
  const [newProfile, setNewProfile] = React.useState({});
  if (isError) ErrorHandler("Error fetching customer data.", "/login/customer");
  if (isLoading) return <Loading />;

  const handleSave = async () => {
    try {
      const res = await patchCustomerData(user.data._id, newProfile);
      if (res.status === 200) {
        mutate();
        toast({
          title: "Success",
          description: "Profile updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error updating profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    handleReset();
  };

  const handleReset = () => {
    setNewProfile({});
  };

  const unsavedChanges = Object.keys(newProfile).length > 0;

  return (
    <>
      <HeaderBar userType={USER_TYPE.CUSTOMER} />
      <Flex
        bg="white"
        w="100%"
        px="5"
        minH="90vh"
        pt="70px"
        flexDirection={"column"}
        justifyContent={"start"}
        alignItems={"start"}
      >
        <Text fontSize="3xl" fontWeight="700" color="green.500" my="4">
          Edit Profile
        </Text>
        <ProfileField
          label="Display Name"
          placeholder={isLoading ? "Loading..." : user.data.name}
          fieldKey="name"
          newProfile={newProfile}
          setNewProfile={setNewProfile}
        />
        <ProfileField
          label="Email"
          placeholder={isLoading ? "Loading..." : user.data.email}
          fieldKey="email"
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          disabled
        />
        <ProfileField
          type="password"
          label="Password"
          placeholder="Enter New Password"
          fieldKey="password"
          newProfile={newProfile}
          setNewProfile={setNewProfile}
        />
        <HStack w="100%" spacing={4} my="8">
          <Button
            w="100%"
            colorScheme="green"
            isDisabled={!unsavedChanges}
            onClick={() => handleSave()}
          >
            Save
          </Button>
          <Button
            w="100%"
            colorScheme="green"
            variant="outline"
            disabled={!unsavedChanges}
            onClick={() => handleReset()}
          >
            Reset
          </Button>
        </HStack>
      </Flex>
      <Footer />
    </>
  );
}

export default Profile;
