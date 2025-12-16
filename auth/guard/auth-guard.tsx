"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/routes/hooks";
import useSocket from "@/hooks/use-socket";
import SplashScreen from "@/components/splash-screen";
import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import useProfile from "@/hooks/use-profile";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { getProfile } = useProfile();

  const { data: user, isLoading } = getProfile();

  const { connectSocket } = useSocket();

  // const { initOneSignal } = useNotifications();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (!isHydrated) {
      return;
    }

    // Validating if user is authenticated redirect to defaultRedirect
    if (!isLoggedIn) {
      router.replace(CONFIG.auth.defaultRedirect);
      return;
    }

    if (isLoading) {
      return;
    }

    // init websocket service
    connectSocket();

    // init OneSignal
    // if (user) {
    //   initOneSignal(user.id);
    // }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isLoggedIn, user, isLoading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
