import { useEffect } from "react";

export function useSetInterval(cb: () => void, ms: number = 1000) {
  return useEffect(() => {
    // Create interval
    const interval = setInterval(cb, ms);
    return () => clearInterval(interval); // Clear interval on unmount
  }, [cb, ms]);
}
