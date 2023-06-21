import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Review from "./pages/Review";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
import ShopDetail from "./pages/customer/ShopDetail";
import { socket } from "./socket";
import { useToast } from "@chakra-ui/react";
import OrderStatusNotification from "./components/OrderStatusNotification";
import ShopFoodNotification from "./components/ShopFoodNotification";

function App() {
  const toast = useToast();
  React.useEffect(() => {
    const token = localStorage.getItem("SHAREPLATE_TOKEN");
    if (token) {
      socket.connect();
    } else {
      socket.disconnect();
    }
    function onConnect() {
      console.log("Connected");
    }

    function onConnected(payload) {
      console.log(payload);
    }

    function onOrderChanged(payload) {
      console.log(payload);
      toast({
        position: "top",
        duration: 10000,
        isClosable: true,
        render: () => <OrderStatusNotification order={payload.order} />,
      });
    }

    function onMenuChanged(payload) {
      console.log(payload);
      toast({
        position: "top",
        duration: 10000,
        isClosable: true,
        render: () => <ShopFoodNotification shop={payload.data} />,
      });
    }

    socket.on("connect", onConnect);
    socket.on("connected", onConnected);
    socket.on("orderStatusChanged", onOrderChanged);
    socket.on("menuChanged", onMenuChanged);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connected", onConnected);
      socket.off("orderStatusChanged", onOrderChanged);
      socket.off("menuChanged", onMenuChanged);
    };
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shops" element={<Shop />} />
        <Route path="/shops/:id" element={<ShopDetail />} />
        <Route path="/login/:type" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/reviews" element={<Review />} />
        <Route path="/:type/:id/reviews" element={<Review />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
