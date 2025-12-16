"use client";

import { paths } from "@/routes/paths";

import { useEffect } from "react";

import { useRouter } from "@/routes/hooks";

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push(paths.dashboard.root);
  }, [router]);

  return null;
}
