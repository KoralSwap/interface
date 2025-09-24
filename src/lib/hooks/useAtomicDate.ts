import { useEffect, useState } from "react";

export function useAtomicDate(delay: number = 1000) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentDateTime(new Date()), delay);
    return () => clearInterval(interval);
  }, [delay]);
  return currentDateTime;
}
