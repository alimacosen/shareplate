import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_ENDPOINT || undefined;

export const socket = io(URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("SHAREPLATE_TOKEN"),
  },
  transports: ["websocket"],
});
