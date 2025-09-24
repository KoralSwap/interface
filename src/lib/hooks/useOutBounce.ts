import { useEffect, useState } from "react";

/**
 * usePadLoading
 * Like Debounce, but only on the way out!
 */
export default function useOutBounce<T>({
  value,
  duration,
}: {
  value: T;
  duration: number;
}) {
  const [outBounce, setOutbounce] = useState<T>();
  useEffect(() => {
    if (value) {
      setOutbounce(value);
    }
    if (!value) {
      const timer = setTimeout(() => {
        setOutbounce(undefined);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, value]);
  return outBounce;
}
