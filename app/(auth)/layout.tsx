"use client";

import { WallpaperTwo } from "@/components/backgrounds";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return <WallpaperTwo>{children}</WallpaperTwo>;
}
