import { useCallback, useRef } from "react";

export function useThrottledCallback<T extends (...args: any[]) => void>(
  callback: T,
  interval: number
) {
  const lastCallRef = useRef<number | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (
        lastCallRef.current === null ||
        now - lastCallRef.current >= interval
      ) {
        callback(...args);
        lastCallRef.current = now;
      }
    },
    [callback, interval]
  );
}
