import * as React from "react";
import { Alert } from "@/components/ui/alert";
import RctInput from "../rctInput";
import { useChainId } from "wagmi";
import { formatUnits, parseEther } from "viem";
import { RCT, RCT_DECIMALS, VE } from "@/data/constants";
import { formatNumber } from "@/lib/utils";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import { useEffect } from "react";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { LockPosition } from "@/gql/graphql";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import useIncreaseLockAmount from "../__hooks__/useIncreaseLockAmount";

// Local constants

export default function IncreaseContent({
  lockPosition,
  onTransactionComplete,
}: {
  lockPosition: LockPosition;
  onTransactionComplete?: () => void;
}) {
  const chainId = useChainId();
  const rct = React.useMemo(() => RCT[chainId], [chainId]); // RCT
  const ve = React.useMemo(() => VE[chainId], [chainId]); // Escrow
  const [amount, setAmount] = React.useState(0);
  const { balance, refresh: refreshBalance } = useGetBalance(rct, 30_000);
  const { setToast } = useTransactionToastProvider();

  const { isAllowed: allowedToSpendRCT, refresh: refreshAllowance } =
    useCheckAllowance(rct, ve, parseEther(amount.toString()), 15000);
  const {
    execute: executeGrantApproval,
    isPending: approvalPending,
    isSuccess: approvalSuccess,
    isError: approvalError,
    reset: resetApproval,
  } = useGrantApproval({
    token: rct,
    spender: ve,
    amount: parseEther(amount.toString()),
    onSuccess: (hash) => {
      setToast({
        toastType: "success",
        actionTitle: "RCT spend approved for escrow",
        actionDescription: "Escrow was allowed to spend your RCT",
        hash,
      });
      void refreshAllowance();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });
  const {
    execute: executeIncreaseLockAmount,
    isPending: increasePending,
    isSuccess: increaseSuccess,
    isError: increaseError,
    reset: resetIncrease,
  } = useIncreaseLockAmount({
    value: parseEther(amount.toString()),
    tokenId: BigInt(lockPosition.lockId),
    onSuccess: (hash) => {
      setToast({
        toastType: "success",
        actionTitle: "Lock amount was successfully increased",
        actionDescription: "",
        hash,
      });
      void refreshBalance();
      void refreshAllowance();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsedNumber = Number(e.target.value);
      const changeValue = isNaN(parsedNumber) ? amount : parsedNumber;
      setAmount(changeValue);
    },
    [amount, setAmount]
  );

  const buttonState = React.useMemo(() => {
    if (!allowedToSpendRCT) return ButtonState.Approve;
    if (approvalPending || increasePending) return ButtonState.Loading;
    return ButtonState.Default;
  }, [allowedToSpendRCT, approvalPending, increasePending]);

  const buttonChild = React.useMemo(
    () =>
      buttonState === ButtonState.Approve
        ? "Approve to spend RCT"
        : "Increase Lock Amount",
    [buttonState]
  );

  const onSubmit = React.useCallback(() => {
    if (!allowedToSpendRCT) {
      executeGrantApproval();
      return;
    }
    executeIncreaseLockAmount();
  }, [allowedToSpendRCT, executeIncreaseLockAmount, executeGrantApproval]);

  const isValid = React.useMemo(() => {
    return amount > 0 && balance > parseEther(amount.toString());
  }, [amount, balance]);

  useEffect(() => {
    if (approvalError || approvalSuccess) resetApproval();
    if (increaseError || increaseSuccess) {
      resetIncrease();
      if (onTransactionComplete) onTransactionComplete();
    }
  }, [
    approvalError,
    approvalSuccess,
    increaseError,
    increaseSuccess,
    onTransactionComplete,
    resetApproval,
    resetIncrease,
  ]);

  return (
    <div className="space-y-4 pt-4 w-full">
      <div className="flex justify-between">
        <h4>Add to lock</h4>
        <h5 className="text-neutral-300 text-[13px]">
          Available:{" "}
          <span className="text-white">
            <DisplayFormattedNumber
              num={formatNumber(formatUnits(balance, RCT_DECIMALS))}
            />{" "}
            RCT
          </span>
        </h5>
      </div>

      <RctInput value={amount} onChange={handleInputChange} />
      <h3 className="text-lg">Estimates</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <h5 className="text-sm text-neutral-200">Deposit</h5>
          <h5 className="text-neutral-100">{formatNumber(amount)} RCT</h5>
        </div>
      </div>
      <Alert colors={"muted"}>
        Depositing into the lock will increase your voting power and rewards.
        You can also extend the lock duration.
      </Alert>
      <SubmitButton state={buttonState} onClick={onSubmit} isValid={isValid}>
        {buttonChild}
      </SubmitButton>
    </div>
  );
}
