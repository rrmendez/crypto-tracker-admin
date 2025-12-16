import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterValues = Record<string, unknown>;

interface FiltersState {
  filters: Record<string, FilterValues>;
  setFilters: (key: string, values: FilterValues) => void;
  clearFilters: (key: string) => void;
  getFilters: (key: string) => FilterValues | undefined;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      filters: {},
      setFilters: (key, values) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: values,
          },
        })),
      clearFilters: (key) =>
        set((state) => {
          const updated = { ...state.filters };
          delete updated[key];
          return { filters: updated };
        }),
      getFilters: (key) => get().filters[key],
    }),
    {
      name: "fs-table-filters",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
