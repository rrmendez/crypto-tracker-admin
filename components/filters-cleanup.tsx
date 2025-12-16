"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFiltersStore } from "@/stores/filtersStore";

export function FiltersCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    const state = useFiltersStore.getState();

    const filterKeysToWatch = [
      { key: "user-table", basePath: "/users" },
      { key: "clients-table", basePath: "/clients" },
      { key: "compliance-table", basePath: "/compliance" },
      { key: "deposits-table", basePath: "/transactions/deposits" },
      { key: "withdrawals-table", basePath: "/transactions/withdrawals" },
      { key: "currencies-table", basePath: "/settings/currencies" },
      { key: "fees-table", basePath: "/settings/fees" },
      { key: "limits-table", basePath: "/settings/limits" },
    ];

    for (const { key, basePath } of filterKeysToWatch) {
      const shouldClear = !pathname.startsWith(basePath);
      if (shouldClear) {
        state.clearFilters(key);
      }
    }
  }, [pathname]);

  return null;
}
