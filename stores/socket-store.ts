import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ----------------------------------------------------------------------

export interface SocketStateStore {
  socket: WebSocket | null;
}
export interface SocketActionsStore {
  setSocket: (socket: WebSocket) => void;
}

export const useSocketStore = create<SocketStateStore & SocketActionsStore>()(
  immer((set) => ({
    socket: null,

    setSocket: (socket) =>
      set((state) => {
        state.socket = socket;
      }),
  }))
);
