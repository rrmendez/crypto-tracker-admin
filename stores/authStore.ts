"use client";

import { Role } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// -----------------------------------------------------------------------------
// Tipado
// -----------------------------------------------------------------------------
type AuthState = {
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  isValidating: boolean;
  role?: Role;

  // actions
  logOut: () => void;
  logIn: (accessToken: string, refreshToken: string) => void;
  setIsValidating: (isValidating: boolean) => void;

  // hydration flag
  isHydrated: boolean;
  setHydrated: () => void;
};

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // --- state --------------------------------------------------------------
      accessToken: "",
      refreshToken: "",
      isLoggedIn: false,
      isValidating: false,
      role: undefined,

      // --- hydration ----------------------------------------------------------
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      // --- actions ------------------------------------------------------------
      logIn: (accessToken, refreshToken) => set({ isLoggedIn: true, accessToken, refreshToken }),
      setIsValidating: (isValidating) => set({ isValidating }),

      logOut: () =>
        set({
          isLoggedIn: false,
          isValidating: false,
          role: undefined,
          accessToken: "",
          refreshToken: "",
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      // (opcional) guarda solo lo que necesites
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
        isValidating: state.isValidating,
        role: state.role,
      }),
    }
  )
);
