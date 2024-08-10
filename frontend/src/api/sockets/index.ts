import { Manager } from "socket.io-client";

export const manager = new Manager("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
});
