import { ORDER_STATUS } from "../enum";
import PropTypes from "prop-types";
import { Badge } from "@chakra-ui/react";
import { ORDER_STATUS_MAP } from "../mapping";

function OrderStatusBadge({ status, ...props }) {
  const statusColor = {
    [ORDER_STATUS.PENDING]: "yellow",
    [ORDER_STATUS.CONFIRMED]: "green",
    [ORDER_STATUS.COMPLETED]: "gray",
    [ORDER_STATUS.CANCELED]: "red",
  };
  return (
    <Badge
      colorScheme={statusColor[status]}
      {...props}
      variant="outline"
      fontWeight="800"
    >
      {ORDER_STATUS_MAP[status]}
    </Badge>
  );
}

OrderStatusBadge.defaultProps = { status: ORDER_STATUS.PENDING };
OrderStatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(ORDER_STATUS)),
};

export default OrderStatusBadge;
