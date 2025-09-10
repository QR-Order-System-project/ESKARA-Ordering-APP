import { io } from "socket.io-client";

const URL = "https://eskara-ordering-app.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
});