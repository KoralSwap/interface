import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { LockPosition } from "@/gql/graphql";
import useExtendLockTime from "../__hooks__/useExtendLockTime";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";

// Local constants
const YEARS_2 = 62208000;
const DAYS_14 = 1209600;

export default function ExtendContent({
  lockPosition,
  onTransactionComplete,
}: {
  lockPosition: LockPosition;
  onTransactionComplete?: () => void;
}) {
  const now = useAtomicDate();
  const [duration, setDuration] = useState(DAYS_14);
  const { setToast } = useTransactionToastProvider();
  const {
    execute: executeExtendLockTime,
    isPending: extendPending,
    isSuccess: extendSuccess,
    isError: extendError,
    reset: resetExtension,
  } = useExtendLockTime({
    duration: BigInt(duration),
    tokenId: BigInt(lockPosition.lockId),
    onSuccess: (hash) =>
      setToast({
        toastType: "success",
        actionTitle: "Lock time was successfully extended",
        actionDescription: "",
        hash,
      }),
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  const buttonState = useMemo(() => {
    if (extendPending) return ButtonState.Loading;
    return ButtonState.Default;
  }, [extendPending]);

  const { newDate, days } = useMemo(() => {
    const newTimestamp = now.getTime() + duration * 1000;
    const date = new Date(newTimestamp);
    const newDate = date.toLocaleDateString();
    const days = secondsToDays(duration);
    return { newDate, days };
  }, [duration, now]);

  useEffect(() => {
    if (extendSuccess || extendError) {
      resetExtension();
      if (onTransactionComplete) onTransactionComplete();
    }
  }, [extendError, extendSuccess, onTransactionComplete, resetExtension]);

  return (
    <div className="space-y-4 pt-4">
      <Slider
        value={[duration]}
        defaultValue={[DAYS_14]}
        onValueChange={([value]) => setDuration(value)}
        max={YEARS_2}
        min={DAYS_14}
        step={86400}
      />
      <div className="w-full flex justify-between text-[13px] text-neutral-400">
        <span>Min</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
        <span>Max</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <h5 className="text-sm text-neutral-200">Deposit</h5>
          <h5 className="">{days} Days</h5>
        </div>
        <div className="flex justify-between text-sm">
          <h5 className="text-sm text-neutral-200">New lock time</h5>
          <h5 className="">{newDate}</h5>
        </div>
      </div>

      <Alert colors="muted">
        You can extend lock or increase the lock amount. These actions will
        increase your voting power. The maximum lock time is 2 years.
      </Alert>
      <SubmitButton
        onClick={executeExtendLockTime}
        isValid={secondsToDays(duration) <= 365 * 2}
        state={buttonState}
      >
        Extend Lock Time
      </SubmitButton>
    </div>
  );
}

function secondsToDays(seconds: number): number {
  return Math.floor(seconds / (60 * 60 * 24));
}
