import PropTypes from "prop-types";
import { Tag, TagLeftIcon, TagLabel } from "@chakra-ui/react";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { GiFoodTruck } from "react-icons/gi";
import { USER_TYPE_MAP } from "../mapping";
import { USER_TYPE } from "../enum";

function UserTypeTag({ type, size }) {
  const UserIcon = (type) => {
    switch (type) {
      case USER_TYPE.CUSTOMER:
        return FaUserFriends;
      case USER_TYPE.SHOP:
        return GiFoodTruck;
      default:
        return FaUser;
    }
  };
  return (
    <Tag
      size={size}
      variant={type === USER_TYPE.CUSTOMER ? "subtle" : "solid"}
      colorScheme="green"
      rounded="full"
      fontWeight="700"
    >
      <TagLeftIcon as={UserIcon(type)} />
      <TagLabel>{USER_TYPE_MAP[type]}</TagLabel>
    </Tag>
  );
}

UserTypeTag.defaultProps = {
  size: "md",
};
UserTypeTag.propTypes = {
  type: PropTypes.oneOf(Object.values(USER_TYPE)).isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};
export default UserTypeTag;
