import { io } from "socket.io-client";

export function createKitchenSocket(token: string) {
  return io(
    import.meta.env.VITE_SOCKET_URL || window.location.origin,
    {
      path: "/socket.io",
      autoConnect: false,
      auth: { token },
      reconnection: true,
    }
  );
}