import { io } from "socket.io-client";
import { API_URL } from "./config";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  }

  socket.auth = { token: localStorage.getItem("token") };
  return socket;
};
