import { Wallet } from "@/types/wallets";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ----------------------------------------------------------------------

export interface WalletState {
  selectedWallet?: Wallet;
  setSelectedWallet: (wallet: Wallet) => void;
}

export const useWalletStore = create<WalletState>()(
  immer((set) => ({
    selectedWallet: undefined,

    setSelectedWallet: (wallet) => set({ selectedWallet: wallet }),
  }))
);
