import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import ManageLockDropdown from "./manageLockDropdown";
import { LockPosition } from "@/gql/graphql";
import useLockQueries from "@/lib/hooks/envio/useLockQueries";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import useMergeLocks from "../__hooks__/useMergeLocks";

export default function MergeContent({
  lockPosition,
  onTransactionComplete,
}: {
  lockPosition: LockPosition;
  onTransactionComplete?: () => void;
}) {
  const { useQLGetAccountLockPositions } = useLockQueries();
  const { data: QLLockPositions } = useQLGetAccountLockPositions(1000, 60_000);
  const [selectedLockPosition0, setSelectedLockPosition0] =
    useState<LockPosition>();
  const { setToast } = useTransactionToastProvider();
  const {
    execute: executeMerge,
    isPending: mergePending,
    isSuccess: mergeSuccess,
    isError: mergeError,
    reset: resetMerge,
  } = useMergeLocks({
    tokenId0: BigInt(selectedLockPosition0?.lockId || 0),
    tokenId1: BigInt(lockPosition.lockId),
    onSuccess: (hash) =>
      setToast({
        toastType: "success",
        actionTitle: "Locks were successfully merged",
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
    if (mergePending) return ButtonState.Loading;
    return ButtonState.Default;
  }, [mergePending]);

  useEffect(() => {
    if (mergeSuccess || mergeError) {
      resetMerge();
      if (onTransactionComplete) onTransactionComplete();
    }
  }, [mergeError, mergeSuccess, onTransactionComplete, resetMerge]);

  return (
    <div className="space-y-4 pt-4">
      <h2>Merge with</h2>
      {QLLockPositions && (
        <ManageLockDropdown
          lockPositions={
            QLLockPositions.LockPosition.filter(
              (token) =>
                token.lockId !== selectedLockPosition0?.lockId &&
                token.lockId !== lockPosition.lockId
            ) as LockPosition[]
          }
          onPositionSelected={(value) => {
            setSelectedLockPosition0(
              QLLockPositions.LockPosition.find(
                (lock) => lock.lockId === value?.lockId
              ) as LockPosition | undefined
            );
          }}
          selectedLockPosition={selectedLockPosition0}
        />
      )}
      <div className="p-3 bg-neutral-950 border border-neutral-900/80 rounded-sm ">
        <h2>Estimates</h2>
      </div>
      {/* <div className="flex justify-between p-2 ">
        <h5 className="text-sm text-neutral-200">Deposit</h5>
        <h5 className="text-neutral-100">0.00 RCT</h5>
      </div> */}
      <Alert colors={"muted"}>
        Merging locks will inherit the longest lock time of the two and will
        increase the final Lock voting power by adding up the two underlying
        locked amounts based on the new lock time.
      </Alert>
      <SubmitButton
        onClick={executeMerge}
        state={buttonState}
        isValid={!!lockPosition && !!selectedLockPosition0}
      >
        Merge
      </SubmitButton>
    </div>
  );
}
