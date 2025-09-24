import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import RctInput from "../rctInput";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert } from "@/components/ui/alert";
import EstimatesHeader from "../estimateHeader";
import EstimateRow from "../estimateRow";
import { useChainId } from "wagmi";
import { formatEther, parseEther } from "viem";
import { RCT, VE } from "@/data/constants";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import { formatNumber } from "@/lib/utils";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import useCreateLock from "../__hooks__/useCreateLock";
import { useRouter } from "next/navigation";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";

// Local constants
const YEARS_2 = 62208000;
const DAYS_14 = 1209600;

export default function CreateLockDialog() {
  const chainId = useChainId();
  const now = useAtomicDate();
  const rct = useMemo(() => RCT[chainId], [chainId]); // RCT
  const ve = useMemo(() => VE[chainId], [chainId]); // Escrow
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(DAYS_14);
  const [open, setOpen] = useState(false);
  const { balance, refresh: refreshBalance } = useGetBalance(rct, 30000);
  const { setToast } = useTransactionToastProvider();
  const router = useRouter();

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
    execute: executeLock,
    isPending: lockPending,
    isSuccess: lockSuccess,
    isError: lockError,
    reset: resetLock,
  } = useCreateLock({
    value: parseEther(amount.toString()),
    duration: BigInt(duration),
    onSuccess: (hash) => {
      setToast({
        toastType: "success",
        actionTitle: "Lock was successfully created",
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsedNumber = Number(e.target.value);
      const changeValue = isNaN(parsedNumber) ? amount : parsedNumber;
      setAmount(changeValue);
    },
    [amount, setAmount]
  );

  const buttonState = useMemo(() => {
    if (!allowedToSpendRCT) return ButtonState.Approve;
    if (approvalPending || lockPending) return ButtonState.Loading;
    return ButtonState.Default;
  }, [allowedToSpendRCT, approvalPending, lockPending]);

  const buttonChild = useMemo(
    () =>
      buttonState === ButtonState.Approve ? "Approve to spend RCT" : "Lock",
    [buttonState]
  );

  const onSubmit = useCallback(() => {
    if (!allowedToSpendRCT) {
      executeGrantApproval();
      return;
    }
    executeLock();
  }, [allowedToSpendRCT, executeLock, executeGrantApproval]);

  const dateString = useMemo(() => {
    const newTimestamp = now.getTime() + duration * 1000;
    const date = new Date(newTimestamp);
    return date.toLocaleDateString();
  }, [duration, now]);

  const isValid = useMemo(
    () => amount > 0 && balance > parseEther(amount.toString()),
    [amount, balance]
  );

  useEffect(() => {
    if (approvalError || approvalSuccess) resetApproval();
    if (lockSuccess || lockError) {
      resetLock();
      if (lockSuccess) setTimeout(() => router.refresh(), 3000);
    }
  }, [
    approvalError,
    approvalSuccess,
    lockError,
    lockSuccess,
    resetApproval,
    resetLock,
    router,
    router.refresh,
  ]);

  const { width: windowWidth = 0 } = useWindowDimensions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        className="inline-flex"
        size={windowWidth < 601 ? "sm" : "md"}
        variant="outline"
      >
        Create Lock
      </Button>
      <DialogContent className="space-y-2 max-w-[520px]">
        <DialogTitle className="text-lg">
          Create <span className="text-primary-400">lock</span>
        </DialogTitle>
        <div>
          <div className="flex justify-between">
            <label htmlFor="">Amount to Lock</label>
            <span className="text-sm">
              <span className="text-neutral-200">Available:</span>{" "}
              <DisplayFormattedNumber
                num={formatNumber(formatEther(balance))}
              />{" "}
              RCT
            </span>
          </div>
          <div className="pt-2"></div>
          <RctInput
            value={String(amount)}
            name="amount"
            onChange={handleInputChange}
          />
        </div>
        <div className="border-t border-neutral-800 my-2"></div>
        <div className="space-y-3">
          <h2 className="font-medium">
            Locking For {secondsToDays(duration)} Days
          </h2>
          <Slider
            onValueChange={([value]) => setDuration(value)}
            defaultValue={[duration]}
            min={DAYS_14}
            max={YEARS_2}
            step={86400}
          />
          <div className="flex justify-between text-sm text-neutral-200 ">
            <span>Min</span>
            <span>.</span>
            <span>.</span>
            <span>Max</span>
          </div>
        </div>
        <div className="space-y-2">
          <EstimatesHeader />
          <div className="pt-2"></div>
          <EstimateRow title="Deposit" value={`${amount} RCT`} />
          <EstimateRow title="Voting Power" value="0.00 RCT" />
          <EstimateRow title="Unlock Date" value={dateString} />
        </div>
        <div className="border-t border-neutral-800 my-2"></div>
        <Alert colors="muted">
          Locking will give you an NFT, referred to as a veNFT. You can increase
          the Lock amount or extend the Lock time at any point after.
        </Alert>
        <div className="pt-2">
          <SubmitButton
            state={buttonState}
            onClick={onSubmit}
            isValid={isValid}
          >
            {buttonChild}
          </SubmitButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function secondsToDays(seconds: number): number {
  return Math.floor(seconds / (60 * 60 * 24));
}
