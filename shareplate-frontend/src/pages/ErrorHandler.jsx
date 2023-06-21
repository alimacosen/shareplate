import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

function ErrorHandler({ errorMsg, callbackRoute = "/", clearCookies = true }) {
  const navigate = useNavigate();
  const toast = useToast();
  toast({
    title: "Oops! An error occurred.",
    description: errorMsg,
    status: "error",
    duration: 3000,
    isClosable: true,
  });
  if (clearCookies) {
    localStorage.removeItem("SHAREPLATE_ID");
    localStorage.removeItem("SHAREPLATE_TOKEN");
  }
  navigate(callbackRoute);
}

export default ErrorHandler;
