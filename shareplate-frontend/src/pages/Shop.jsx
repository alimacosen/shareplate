import CustomerShop from "./customer/Shop";
import PageStrategy from "./PageStrategy";
import ShopShop from "./shop/Shop";

function Shop() {
  return PageStrategy(<CustomerShop />, <ShopShop />);
}

export default Shop;
