import React, { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Address, getAddress, isAddress, zeroAddress } from "viem";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { LockPosition } from "@/gql/graphql";
import useTransferLock from "../__hooks__/useTransferLock";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";

export default function TransferContent({
  lockPosition,
  onTransactionComplete,
}: {
  lockPosition: LockPosition;
  onTransactionComplete?: () => void;
}) {
  const [toAddress, setToAddress] = React.useState<Address>(zeroAddress);
  const { setToast } = useTransactionToastProvider();
  const {
    execute: executeTransferLock,
    isPending: transferPending,
    isSuccess: transferSuccess,
    isError: transferError,
    reset: resetTransfer,
  } = useTransferLock({
    tokenId: BigInt(lockPosition.lockId),
    to: toAddress,
    onSuccess: (hash) =>
      setToast({
        toastType: "success",
        actionTitle: "Lock was successfully transferred",
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
    () => (transferPending ? ButtonState.Loading : ButtonState.Default),
    [transferPending]
  );
  const isValid = useMemo(
    () => isAddress(toAddress) && toAddress !== zeroAddress,
    [toAddress]
  );

  useEffect(() => {
    if (transferSuccess || transferError) {
      resetTransfer();
      if (onTransactionComplete) onTransactionComplete();
    }
  }, [onTransactionComplete, resetTransfer, transferError, transferSuccess]);

  return (
    <div className="space-y-4 pt-4">
      <div className="pt-2">
        <label htmlFor="destination">Destination Address</label>
        <div className="pt-1"></div>
        <Input
          placeholder="0x..."
          onChange={(e) => setToAddress(getAddress(e.target.value))}
          value={toAddress}
          className="bg-neutral-1000"
        />
      </div>
      <Alert colors={"muted"}>
        Transferring a lock will also transfer any rewards and rebases! Before
        continuing, please make sure you have claimed all available rewards.
      </Alert>
      <SubmitButton
        onClick={executeTransferLock}
        state={buttonState}
        isValid={isValid}
      >
        Transfer
      </SubmitButton>
    </div>
  );
}
