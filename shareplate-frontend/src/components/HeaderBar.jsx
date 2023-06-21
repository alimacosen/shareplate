import {
  Flex,
  Text,
  Image,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
} from "@chakra-ui/react";
import {
  FaHamburger,
  FaClipboardList,
  FaCommentDots,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import sharePlateLogo from "../images/shareplate.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { useUser } from "../api/swr";
import { USER_TYPE_MAP } from "../mapping";
import PropTypes from "prop-types";
import { USER_TYPE } from "../enum";

function HeaderBar({ userType }) {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignOut = () => {
    localStorage.removeItem("SHAREPLATE_ID");
    localStorage.removeItem("SHAREPLATE_TOKEN");
    navigate(`/login/${userType == USER_TYPE.CUSTOMER ? "customer" : "shop"}`);
    window.location.reload();
  };

  const { user, isError, isLoading } = useUser(userType);
  if (isError) {
    toast({
      title: "Error",
      description: "Something went wrong. Please login again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    localStorage.removeItem("SHAREPLATE_ID");
    localStorage.removeItem("SHAREPLATE_TOKEN");
    navigate("/");
  }

  return (
    <Flex
      h="64px"
      w="100%"
      px="4"
      py="2"
      bg="white"
      justifyContent="space-between"
      alignItems="center"
      position="fixed"
      zIndex="10"
    >
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<GiHamburgerMenu />}
          variant="ghost"
          size="lg"
        />
        <MenuList>
          <MenuItem icon={<FaHamburger />} onClick={() => navigate("/shops")}>
            {userType === USER_TYPE.CUSTOMER ? "Shops" : "Foods"}
          </MenuItem>
          <MenuItem
            icon={<FaClipboardList />}
            onClick={() => navigate("/orders")}
          >
            Orders
          </MenuItem>
          <MenuItem
            icon={<FaCommentDots />}
            onClick={() => navigate("/reviews")}
          >
            Reviews
          </MenuItem>
          <MenuDivider />
          <Flex flexDirection="column" alignItems="start" px="4" mb="2">
            <Text fontSize="md" fontWeight="700" color="green.600">
              {isLoading ? "Loading..." : user.data.name}
            </Text>
            <Text fontSize="sm" fontWeight="500" color="gray.500">
              {isLoading ? "Loading..." : user.data.email}
            </Text>
            <Text fontSize="xs" fontWeight="500" color="gray.500" my="1">
              {isLoading
                ? "Loading..."
                : USER_TYPE_MAP[user.data.type] + " Account"}
            </Text>
          </Flex>
          <MenuItem icon={<FaEdit />} onClick={() => navigate("/profile")}>
            Edit Profile
          </MenuItem>
          <MenuItem
            color="red.500"
            icon={<FaSignOutAlt />}
            onClick={() => handleSignOut()}
          >
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
      <Image
        src={sharePlateLogo}
        alt="SharePlate"
        h="36px"
        w="auto"
        cursor="pointer"
        onClick={() => navigate("/")}
      />
      <Flex w="12" />
    </Flex>
  );
}

HeaderBar.defaultProps = {};

HeaderBar.propTypes = {
  userType: PropTypes.oneOf([USER_TYPE.CUSTOMER, USER_TYPE.SHOP]).isRequired,
};

export default HeaderBar;
