import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem("token"),
      },
    });
  }

  socket.auth = { token: localStorage.getItem("token") };
  return socket;
};
