import PageStrategy from "./PageStrategy";
import CustomerProfile from "./customer/Profile";
import ShopProfile from "./shop/Profile";
function Profile() {
  return PageStrategy(<CustomerProfile />, <ShopProfile />);
}

export default Profile;
