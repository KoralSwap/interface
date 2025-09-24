import React, { useEffect, useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { LockPosition } from "@/gql/graphql";
import useWithdrawLock from "../__hooks__/useWithdrawLock";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";

export default function WithdrawContent({
  lockPosition,
  onTransactionComplete,
}: {
  lockPosition: LockPosition;
  onTransactionComplete?: () => void;
}) {
  const { setToast } = useTransactionToastProvider();
  const {
    execute: executeWithdrawLock,
    isPending: withdrawalPending,
    isSuccess: withdrawalSuccess,
    isError: withdrawalError,
    reset: resetWithdrawal,
  } = useWithdrawLock({
    tokenId: BigInt(lockPosition.lockId),
    onSuccess: (hash) =>
      setToast({
        toastType: "success",
        actionTitle: "Lock was successfully withdrawn",
        actionDescription: "",
        hash,
      }),
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  const buttonState = useMemo(
    () => (withdrawalPending ? ButtonState.Loading : ButtonState.Default),
    [withdrawalPending]
  );

  useEffect(() => {
    if (withdrawalError || withdrawalSuccess) {
      resetWithdrawal();
      if (onTransactionComplete) onTransactionComplete();
    }
  }, [
    onTransactionComplete,
    resetWithdrawal,
    withdrawalError,
    withdrawalSuccess,
  ]);

  return (
    <div className="space-y-4 pt-4">
      <Alert colors="muted">Withdraw RCT from your expired locks.</Alert>
      <SubmitButton
        onClick={executeWithdrawLock}
        state={buttonState}
        isValid={!!lockPosition}
      >
        Withdraw
      </SubmitButton>
    </div>
  );
}
