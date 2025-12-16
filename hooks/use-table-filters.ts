"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFiltersStore } from "@/stores/filtersStore";

export function useTableFilters<T extends Record<string, unknown>>(
  key: string,
  defaultValues: T,
  basePath: string
) {
  const pathname = usePathname();
  const router = useRouter();

  const stored = useFiltersStore((s) => s.getFilters(key)) as T | undefined;

  const initialFilters = useMemo(() => {
    return { ...defaultValues, ...stored };
  }, [defaultValues, stored]);

  const [filters, setLocalFilters] = useState<T>(initialFilters);

  const setFilters = (values: Partial<T>) => {
    setLocalFilters((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const navigateWithSavedFilters = (
    key: string,
    filters: Record<string, unknown>,
    path: string
  ) => {
    useFiltersStore.getState().setFilters(key, filters);
    router.push(path);
  };

  const clearFilters = () => {
    setLocalFilters(defaultValues);
    useFiltersStore.getState().clearFilters(key);
  };

  useEffect(() => {
    const isOnBasePath = pathname.startsWith(basePath);
    if (!isOnBasePath) {
      useFiltersStore.getState().clearFilters(key);
    }
  }, [pathname, basePath, key]);

  return {
    filters,
    setFilters,
    clearFilters,
    navigateWithSavedFilters,
  };
}
