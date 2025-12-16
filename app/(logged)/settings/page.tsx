"use client";

import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the currencies page if the user is not on it
    router.replace(paths.settings.currencies.root);
  }, [router]);
}
