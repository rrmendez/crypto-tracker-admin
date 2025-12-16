"use client";

import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useEffect } from "react";

export default function TransactionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(paths.transactions.deposits.root);
  }, [router]);
}
