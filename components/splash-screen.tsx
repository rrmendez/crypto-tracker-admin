"use client";

import { cn } from "@/lib/utils";
import { AppLogoWithText, AppLogoWithTextDark } from "./custom/vectors";
import { useTheme } from "next-themes";

// ----------------------------------------------------------------------

export default function SplashScreen() {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={cn(
        "fixed inset-0 flex justify-center items-center z-50",
        "bg-[radial-gradient(at_left_top,_var(--primary-50)_60%,_var(--primary-200)_100%)]",
        "dark:bg-[radial-gradient(at_left_top,_var(--primary-950)_60%,_var(--primary-800)_100%)]"
      )}
    >
      <div className="flex flex-col gap-4 items-center justify-center text-center">
        {resolvedTheme === "dark" ? <AppLogoWithTextDark /> : <AppLogoWithText />}
      </div>
    </div>
  );
}
