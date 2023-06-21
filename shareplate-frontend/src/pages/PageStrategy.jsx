import { USER_TYPE } from "../enum";
import { getAccountTypeByToken } from "../utils";
import Root from "./Root";

function PageStrategy(customerPage, shopPage) {
  const token = localStorage.getItem("SHAREPLATE_TOKEN");
  if (!token) {
    return <Root />;
  }
  const accountType = getAccountTypeByToken(token);
  // Enum: 0 = customer, 1 = shop
  switch (accountType) {
    case USER_TYPE.CUSTOMER:
      return customerPage;
    case USER_TYPE.SHOP:
      return shopPage;
    default:
      localStorage.removeItem("SHAREPLATE_TOKEN");
      localStorage.removeItem("SHAREPLATE_ID");
      return <Root />;
  }
}

export default PageStrategy;
