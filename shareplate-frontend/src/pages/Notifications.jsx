import { Flex, IconButton, Text } from "@chakra-ui/react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationRow from "../components/NotificationRow";
import { customerNotifications } from "../mock/notifications";

function Notifications() {
  const navigate = useNavigate();
  return (
    <Flex
      w="100%"
      minH="90vh"
      justifyContent="start"
      alignItems="center"
      flexDirection="column"
      overflow="auto"
    >
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
        <IconButton
          variant="ghost"
          aria-label="Menu"
          icon={<FaArrowLeft />}
          size="lg"
          onClick={() => navigate(-1)}
        />
        <Text fontSize="2xl" fontWeight="700" color="gray.600">
          Notifications
        </Text>
        <IconButton
          variant="ghost"
          aria-label="Menu"
          icon={<FaHome />}
          size="lg"
          onClick={() => navigate("/")}
        />
      </Flex>
      <Flex
        w="100%"
        pt="64px"
        justifyContent="start"
        alignItems="center"
        flexDirection="column"
      >
        {customerNotifications.map((notification) => (
          <NotificationRow notification={notification} key={notification.id} />
        ))}
      </Flex>
    </Flex>
  );
}

export default Notifications;
