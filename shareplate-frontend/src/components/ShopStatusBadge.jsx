import PropTypes from "prop-types";
import { Badge, HStack, Text, Icon } from "@chakra-ui/react";
import { FaStore, FaStoreSlash } from "react-icons/fa";

function ShopStatusBadge({ status, ...props }) {
  return (
    <Badge
      colorScheme={status ? "green" : "gray"}
      variant={status ? "solid" : "outline"}
      fontWeight="800"
      {...props}
    >
      <HStack>
        <Icon as={status ? FaStore : FaStoreSlash} mr="-1" />
        <Text>{status ? "Open" : "Closed"}</Text>
      </HStack>
    </Badge>
  );
}

ShopStatusBadge.propTypes = {
  status: PropTypes.bool,
};

export default ShopStatusBadge;
