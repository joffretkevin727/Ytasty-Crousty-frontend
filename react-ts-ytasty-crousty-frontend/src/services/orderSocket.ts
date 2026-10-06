import { io } from "socket.io-client";

export function createKitchenSocket(token: string) {
  return io(
    import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:8080",
    {
      autoConnect: false,
      auth: { token },
      reconnection: true,
    }
  );
}