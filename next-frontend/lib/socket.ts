import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;
  const { user, token } = useAuthStore.getState();
  if (!user) return null;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect", () => {
    socket?.emit("register", {
      role: user.role,
      userId: user.id,
      shopId: user.shopId,
    });
  });

  return socket;
};

export const getSocket = () => socket;
