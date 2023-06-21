import React from "react";
import {
  Flex,
  Text,
  useToast,
  Image,
  Tag,
  TagLeftIcon,
  Button,
  HStack,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useUser } from "../../api/swr";
import HeaderBar from "../../components/HeaderBar";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import { USER_TYPE } from "../../enum";
import { FaBoxOpen, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import FoodForm from "../../components/FoodForm";
import { patchFood, postFood, deleteFood } from "../../api/foods";
import { patchShopData } from "../../api/shops";
import sharePlateCover from "../../images/shareplate_cover.png";
import ListEndText from "../../components/ListEndText";

function Shop() {
  const toast = useToast();
  const { user, mutate, isError, isLoading } = useUser(USER_TYPE.SHOP);
  const [menu, setMenu] = React.useState([]);
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [oldFood, setOldFood] = React.useState({});
  const [modalMode, setModalMode] = React.useState("add");
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    if (user?.data) {
      setMenu(user.data.menu);
    }
  }, [user]);
  if (isError) ErrorHandler("Error fetching shop data.", "/login/shop");
  if (isLoading) return <Loading />;

  const handleAdd = async (newFood) => {
    try {
      // add a new food entry (post food API)
      const res = await postFood(newFood);
      if (res.status === 200) {
        // save the menu to the shop (patch shop API)
        const menuIds = user.data.menu.map((food) => food._id);
        const newFoodId = res.data.foodId;
        menuIds.push(newFoodId);
        const res2 = await patchShopData(user.data._id, { menu: menuIds });
        if (res2.status === 200) {
          mutate();
          onClose();
          toast({
            title: "Success",
            description: "Food Created.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Error Creating Food.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (index) => {
    const id = menu[index]._id;
    try {
      // delete the menu from the shop (patch shop API)
      const menuIds = user.data.menu.map((food) => food._id);
      menuIds.splice(index, 1);
      const res = await patchShopData(user.data._id, {
        menu: menuIds,
      });
      if (res.status === 200) {
        // delete the food entry (delete food API)
        const res2 = await deleteFood(id);
        if (res2.status === 200) {
          mutate();
          toast.closeAll();
          toast({
            title: "Success",
            description: "Food Deleted.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error Deleting Food.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (editedFood) => {
    try {
      // update the food entry (patch food API)
      const res = await patchFood(menu[editingIndex]._id, editedFood);
      if (res.status === 200) {
        mutate();
        onClose();
        toast({
          title: "Success",
          description: "Food Updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error Updating Food.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const editFoodModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${
            modalMode === "add" ? "Add" : "Edit"
          } Food`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FoodForm
              initialValues={oldFood}
              onSubmit={modalMode === "add" ? handleAdd : handleEdit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      <HeaderBar userType={USER_TYPE.SHOP} />
      <Flex
        bg="white"
        w="100vw"
        h="85vh"
        pt="70px"
        px="5"
        flexDirection={"column"}
        justifyContent={"start"}
        alignItems={"start"}
      >
        <Text fontSize="3xl" fontWeight="700" color="green.500" mb="2">
          Food Management
        </Text>
        {editFoodModal()}
        <Flex w="100%" pb="16" flexDirection="column" overflow="scroll">
          {menu.map((food, index) => {
            return (
              <>
                <Flex
                  w="100%"
                  my="4"
                  justifyContent="start"
                  alignItems="center"
                  key={food._id}
                >
                  <Flex w="80px" flexDirection="column" alignItems="end">
                    <Image
                      w="80px"
                      h="80px"
                      src={food.image}
                      fallbackSrc={sharePlateCover}
                      objectFit="cover"
                    />
                    <HStack mt="-20px">
                      <Tag colorScheme="green" size="md" rounded="full">
                        <TagLeftIcon as={FaBoxOpen} mr="1" />
                        {`${food.quantity}`}
                      </Tag>
                    </HStack>
                  </Flex>
                  <Flex
                    flexDirection="column"
                    justifyContent="start"
                    alignItems="start"
                    ml="4"
                    flexGrow="1"
                  >
                    <Text fontSize="xl" fontWeight="700" color="gray.600">
                      {food.foodName}
                    </Text>
                    <Text fontSize="sm" fontWeight="500" color="gray.500">
                      {food.description}
                    </Text>
                    <Text fontSize="lg" fontWeight="600" color="gray.500">
                      {`$${food.price.toFixed(2)}`}
                    </Text>
                  </Flex>
                  <Flex flexDirection="column" justifyContent="end">
                    <Button
                      colorScheme="green"
                      leftIcon={<FaEdit />}
                      onClick={() => {
                        setEditingIndex(index);
                        setModalMode("edit");
                        setOldFood(menu[index]);
                        onOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      mt="2"
                      colorScheme="red"
                      variant="outline"
                      leftIcon={<FaTrash />}
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
                <Divider />
              </>
            );
          })}
          <ListEndText />
        </Flex>

        <Flex
          w="90%"
          py="4"
          bottom="0"
          flexDirection="column"
          position="absolute"
          bg="white"
        >
          <Button
            leftIcon={<FaPlus />}
            colorScheme="green"
            mb="4"
            onClick={() => {
              setOldFood({});
              setModalMode("add");
              onOpen();
            }}
          >
            Add Food
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Shop;
