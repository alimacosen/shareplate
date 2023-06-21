import React, { useEffect } from "react";
import {
  Flex,
  Text,
  Button,
  HStack,
  useToast,
  Checkbox,
  Tag,
  TagLabel,
  Switch,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  TagLeftIcon,
  Fade,
} from "@chakra-ui/react";
import { useUser } from "../../api/swr";
import Footer from "../../components/Footer";
import HeaderBar from "../../components/HeaderBar";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import { patchShopData } from "../../api/shops";
import { USER_TYPE } from "../../enum";
import ProfileField from "../../components/ProfileField";
import { FaLocationArrow, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import { requestPosition } from "../../utils";
import { SHOP_TYPE_LIST, SHOP_TYPE_MAP } from "../../mapping";
import ShopStatusBadge from "../../components/ShopStatusBadge";

function Profile() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, mutate, isError, isLoading } = useUser(USER_TYPE.SHOP);
  const [available, setAvailable] = React.useState(false);
  const [shopTypes, setShopTypes] = React.useState([]);
  const [newProfile, setNewProfile] = React.useState({});
  const [isGettingLocation, setIsGettingLocation] = React.useState(false);
  useEffect(() => {
    if (user?.data) {
      setAvailable(user.data.available);
      setShopTypes(user.data.shopType);
    }
  }, [user]);
  if (isError) ErrorHandler("Error fetching shop data.", "/login/shop");
  if (isLoading) return <Loading />;

  const unsavedChanges =
    Object.keys(newProfile).length > 0 ||
    available !== user.data.available ||
    shopTypes !== user.data.shopType;

  const handleSave = async () => {
    try {
      const res = await patchShopData(user.data._id, {
        ...newProfile,
        available: available,
        shopType: shopTypes,
      });
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
  };

  const handleReset = () => {
    setNewProfile({});
    setAvailable(user.data.available);
    setShopTypes(user.data.shopType);
  };
  const handleShopTypeChange = (type) => {
    if (shopTypes.includes(type)) {
      setShopTypes(shopTypes.filter((t) => t !== type));
    } else {
      setShopTypes([...shopTypes, type]);
    }
  };
  const handleLocationChange = async (position) => {
    try {
      const res = await patchShopData(user.data._id, {
        location: {
          type: "Point",
          coordinates: [position.coords.latitude, position.coords.longitude],
        },
      });
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Location updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        mutate();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error updating location.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const editTypeModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Shop Categories</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="100%" mb="2" flexDirection="column" flexWrap="wrap">
              {SHOP_TYPE_LIST.map((type) => (
                <Checkbox
                  key={type}
                  isChecked={shopTypes.includes(type)}
                  onChange={() => handleShopTypeChange(type)}
                  flex="1"
                  my="2"
                >
                  {SHOP_TYPE_MAP[type] || type}
                </Checkbox>
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              variant="ghost"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // TODO: maybe refactor the added field into ProfileField?
  return (
    <>
      <HeaderBar userType={USER_TYPE.SHOP} />
      {editTypeModal()}
      <Flex
        bg="white"
        w="100%"
        px="5"
        minH="80vh"
        pt="64px"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"start"}
      >
        <HStack w="100%" justifyContent="space-between">
          <Text fontSize="3xl" fontWeight="700" color="green.500" my="4">
            Edit Profile
          </Text>
          <Fade in={unsavedChanges}>
            <Tag size="md" variant="solid" colorScheme="yellow">
              <TagLeftIcon as={FaExclamationTriangle} />
              <TagLabel>Unsaved Changes</TagLabel>
            </Tag>
          </Fade>
        </HStack>
        <Text fontSize="sm" fontWeight="600" color="gray.600" my="2">
          Shop Status
        </Text>
        <HStack spacing="2" mb="4">
          <ShopStatusBadge
            status={false}
            fontSize="md"
            opacity={available ? 0.3 : 1}
          />
          <Switch
            size="lg"
            colorScheme="green"
            defaultChecked={user.data.available}
            isChecked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          <ShopStatusBadge
            status={true}
            fontSize="md"
            opacity={available ? 1 : 0.3}
          />
        </HStack>
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
        <ProfileField
          label="Description"
          placeholder={isLoading ? "Loading..." : user.data.description}
          fieldKey="description"
          newProfile={newProfile}
          setNewProfile={setNewProfile}
        />
        <ProfileField
          label="Image URL"
          placeholder={isLoading ? "Loading..." : user.data.image}
          fieldKey="image"
          newProfile={newProfile}
          setNewProfile={setNewProfile}
        />
        <Flex w="100%" my="2" flexDirection="column">
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            Shop Types
          </Text>
          <Flex justifyContent="start" alignItems="center" mt="2">
            <Flex
              w="100%"
              justifyContent="start"
              alignItems="center"
              mt="2"
              flexWrap="wrap"
            >
              {shopTypes.map((shopType) => {
                return (
                  <Tag
                    w="max-content"
                    size="md"
                    rounded="full"
                    key={shopType}
                    colorScheme="green"
                    variant="subtle"
                    fontWeight="600"
                    mr="1"
                    mb="1"
                  >
                    <TagLabel>{SHOP_TYPE_MAP[shopType]}</TagLabel>
                  </Tag>
                );
              })}
            </Flex>
            <Button colorScheme="green" leftIcon={<FaEdit />} onClick={onOpen}>
              Edit
            </Button>
          </Flex>
        </Flex>
        <Flex w="100%" my="2" flexDirection="column">
          <Flex justifyContent="start" alignItems="center">
            <Text fontSize="sm" fontWeight="600" color="gray.600" my="2">
              Shop Location
            </Text>
          </Flex>
          <Button
            colorScheme="green"
            aria-label="Get current location"
            leftIcon={<FaLocationArrow />}
            isLoading={isGettingLocation}
            loadingText="Setting location..."
            onClick={async () => {
              try {
                setIsGettingLocation(true);
                const position = await requestPosition();
                handleLocationChange(position);
                setIsGettingLocation(false);
              } catch (err) {
                toast({
                  title: "Error",
                  description: "Error getting location.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
                setIsGettingLocation(false);
              }
            }}
          >
            Set to current location
          </Button>
        </Flex>
        <HStack w="100%" spacing={4} my="8">
          <Button
            w="100%"
            colorScheme="green"
            onClick={() => handleSave()}
            isDisabled={!unsavedChanges}
          >
            Save
          </Button>
          <Button
            w="100%"
            colorScheme="green"
            variant="outline"
            isDisabled={!unsavedChanges}
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
