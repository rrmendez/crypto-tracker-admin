import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export function WallpaperThree({ children }: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden flex h-full min-h-dvh w-full flex-col items-center justify-center gap-4 px-4",
        "bg-[url('/assets/backgrounds/wallpaper-background-3.webp')] bg-cover bg-center bg-no-repeat"
      )}
    >
      {children}
    </div>
  );
}
