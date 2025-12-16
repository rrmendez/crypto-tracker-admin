/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";

// ----------------------------------------------------------------------

export const useDebouncedCallback = (func: (...args: any) => void, wait: number) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any) => {
      const later = () => {
        clearTimeout(timeout.current!);
        func(...args);
      };

      clearTimeout(timeout.current!);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
};
