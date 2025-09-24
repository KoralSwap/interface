import { useEffect, useState } from "react";

/**
 * usePadLoading
 * used to stop fast loading UI changes
 *
 */
export default function usePadLoading({
  value,
  duration,
}: {
  value: boolean;
  duration: number;
}) {
  const [outBounce, setOutbounce] = useState(false);
  useEffect(() => {
    if (value) {
      setOutbounce(true);
    }
    if (!value) {
      const timer = setTimeout(() => {
        setOutbounce(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, value]);
  return outBounce;
}
