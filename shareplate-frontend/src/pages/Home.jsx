import CustomerHome from "./customer/Home";
import PageStrategy from "./PageStrategy";
import ShopHome from "./shop/Home";

function Home() {
  return PageStrategy(<CustomerHome />, <ShopHome />);
}

export default Home;
