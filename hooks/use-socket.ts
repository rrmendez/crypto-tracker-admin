"use client";

import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import { useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const useSocket = () => {
  const { accessToken } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);

  const connectSocket = () => {
    if (!accessToken) return;

    // Evita múltiples conexiones
    if (socketRef.current?.connected) return;

    const socket = io(CONFIG.site.serverUrl, {
      transports: ["websocket"],
      auth: {
        token: accessToken,
      },
    });

    // Guardar socket en ref
    socketRef.current = socket;

    // Conectar
    socket.connect();

    // Listener de eventos
    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket desconectado:", reason);
    });

    socket.on("notification", (notification) => {
      console.log("🔔 Notificación recibida:", notification);
      processNotification(notification);
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
      console.log("🔌 Socket desconectado manualmente");
      socketRef.current = null;
    }
  };

  const reconnectSocket = () => {
    disconnectSocket();
    connectSocket();
  };

  // Procesa la notificación recibida
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processNotification = (notification: any) => {
    toast(notification.message);
  };

  return {
    connectSocket,
    disconnectSocket,
    reconnectSocket,
    socket: socketRef.current,
  };
};

export default useSocket;
