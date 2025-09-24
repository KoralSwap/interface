import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import React, { ReactNode, useEffect, useMemo } from "react";

interface CountDownProps {
  targetDate: Date | number;
  render?: (args: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isCompleted: boolean;
  }) => ReactNode;
  onChangeOccur?: (args: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isCompleted: boolean;
  }) => void;
  children?: ReactNode;
}

export const CustomCountdown: React.FC<CountDownProps> = ({
  targetDate,
  render,
  onChangeOccur,
  children,
}) => {
  const now = useAtomicDate();
  const [isCompleted, days, hours, minutes, seconds] = useMemo(() => {
    const currentTimeMillis = now.getTime();
    const targetTimeMillis =
      typeof targetDate === "number" ? targetDate : targetDate.getTime();
    const isCompleted = currentTimeMillis >= targetTimeMillis;
    const diff = !isCompleted ? targetTimeMillis - currentTimeMillis : 0;

    const daysLeft = diff > 0 ? Math.floor(diff / 86400000) % 30 : 0;
    const hoursLeft = diff > 0 ? Math.floor(diff / 3600000) % 24 : 0;
    const minutesLeft = diff > 0 ? Math.floor(diff / 60000) % 60 : 0;
    const secondsLeft = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
    return [isCompleted, daysLeft, hoursLeft, minutesLeft, secondsLeft] as [
      boolean,
      number,
      number,
      number,
      number,
    ];
  }, [now, targetDate]);

  useEffect(() => {
    if (onChangeOccur)
      onChangeOccur({ days, seconds, hours, minutes, isCompleted });
  }, [onChangeOccur, days, seconds, hours, minutes, isCompleted]);

  return !!render ? (
    render({ days, minutes, hours, seconds, isCompleted })
  ) : !!children ? (
    children
  ) : (
    <span className="text-neutral-100 text-sm">
      {!isCompleted ? `${days}:${hours}:${minutes}:${seconds}` : "Complete"}
    </span>
  );
};
