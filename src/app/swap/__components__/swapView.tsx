"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TokensDialog from "@/components/shared/tokensDialog";
import { useChainId } from "wagmi";
import { useV2Swap } from "../__hooks__/useSwap";
import { useV2QuoteSwap } from "../__hooks__/useQuoteSwap";
import { TToken } from "@/lib/types";
import { STRINGS, V2_ROUTER } from "@/data/constants";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import { ArrowDown } from "lucide-react";
import SwapCard from "./swapCard";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import SwapDetails from "./swapDetails";
import { convertETHToWETHIfApplicable } from "@/utils";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import { useV2CheckPair } from "@/lib/hooks/useCheckPair";

export default function SwapView() {
  // Wagmi parameters
  const chainId = useChainId();

  // Amount in
  const [amountIn, setAmountIn] = useState("");
  // Selected tokens
  const [token0, setToken0] = useState<TToken | null>(null);
  const [token1, setToken1] = useState<TToken | null>(null);

  // Modal state
  const [firstDialogOpen, setFirstDialogOpen] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);

  // Active input pane
  const [activePane, setActivePane] = useState<0 | 1>(0);

  // Parsed amount
  const amountInParsed = useMemo(
    () => parseUnits(amountIn, token0?.decimals ?? 18),
    [amountIn, token0]
  );

  // V2 Quote
  const {
    isStable,
    amountOut: v2QuoteAmountOut,
    routesAvailable: v2RoutesAvailable,
  } = useV2QuoteSwap({
    token0: convertETHToWETHIfApplicable(
      token0?.address ?? zeroAddress,
      chainId
    ),
    token1: convertETHToWETHIfApplicable(
      token1?.address ?? zeroAddress,
      chainId
    ),
    amountIn: amountInParsed,
    refetchInterval: 10000,
  });

  // Check pair
  const { exists: v2PairExists, pairAddress: v2Pair } = useV2CheckPair(
    token0?.address ?? zeroAddress,
    token1?.address ?? zeroAddress,
    isStable
  );

  // Router by chain ID
  const v2Router = useMemo(() => V2_ROUTER[chainId], [chainId]);

  const { isAllowed: v2RouterAllowed, refresh: refreshV2Allowance } =
    useCheckAllowance(
      token0?.address ?? zeroAddress,
      v2Router,
      amountInParsed,
      10000
    );

  const amountOutFormatted = useMemo(
    () => formatUnits(v2QuoteAmountOut, token1?.decimals ?? 18),
    [v2QuoteAmountOut, token1?.decimals]
  );

  const { setToast } = useTransactionToastProvider();

  // Grant approval
  const {
    execute: executeGrantV2Approval,
    isPending: v2ApprovalPending,
    reset: resetV2Approval,
    isError: v2ApprovalErrored,
    isSuccess: v2ApprovalSuccessful,
  } = useGrantApproval({
    token: token0?.address,
    spender: v2Router,
    amount: amountInParsed,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Approved " + token0?.symbol,
        toastType: "success",
        actionDescription: "You gave approval to spend tokens",
        hash,
      });

      void refreshV2Allowance();
    },
    onError: (err) =>
      setToast({
        toastType: "error",
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  // Swap
  const {
    execute: executeV2Swap,
    isPending: v2SwapPending,
    reset: resetV2Swap,
    isError: v2SwapErrored,
    isSuccess: v2SwapSuccessful,
  } = useV2Swap({
    token0: token0?.address ?? zeroAddress,
    token1: token1?.address ?? zeroAddress,
    amountIn: amountInParsed,
    stable: isStable,
    anticipatedAmountOut: v2QuoteAmountOut,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Swapped successfully",
        toastType: "success",
        actionDescription: "Swap was successful",
        hash,
      });

      void refreshV2Allowance();
    },
    onError: (err) =>
      setToast({
        toastType: "error",
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  const switchTokens = useCallback(() => {
    const t0 = token0;
    const t1 = token1;
    // Switch
    setToken0(t1);
    setToken1(t0);
  }, [token0, token1]);

  const onSubmit = useCallback(() => {
    if (!v2RouterAllowed) {
      resetV2Approval();
      executeGrantV2Approval();
      return;
    }

    executeV2Swap();
  }, [v2RouterAllowed, resetV2Approval, executeGrantV2Approval, executeV2Swap]);

  const { balance: balance0, refresh: refreshBalance0 } = useGetBalance(
    token0?.address,
    15000
  );

  const buttonState = useMemo(() => {
    if (v2ApprovalPending || v2SwapPending) return ButtonState.Loading;
    else return ButtonState.Default;
  }, [v2ApprovalPending, v2SwapPending]);

  const stateValid = useMemo(
    () =>
      !!token0 &&
      !!token1 &&
      (v2RoutesAvailable || v2PairExists) &&
      (v2RouterAllowed
        ? balance0 >= amountInParsed &&
          amountInParsed > 0n &&
          !isNaN(Number(amountIn))
        : true),
    [
      token0,
      token1,
      v2RouterAllowed,
      balance0,
      amountInParsed,
      amountIn,
      v2RoutesAvailable,
      v2PairExists,
    ]
  );

  const errorMessage = useMemo(() => {
    if (!token0 || !token1) return STRINGS.UNSELECTED_TOKENS;
    if (!v2RoutesAvailable && !v2PairExists) return STRINGS.SWAP_PATH_NOT_FOUND;
    if (balance0 < amountInParsed) return STRINGS.INSUFFICIENT_BALANCE;
  }, [
    balance0,
    amountInParsed,
    token0,
    token1,
    v2RoutesAvailable,
    v2PairExists,
  ]);

  useEffect(() => {
    if (v2SwapSuccessful || v2SwapErrored) {
      resetV2Swap();
      void refreshBalance0();
      return;
    }

    if (v2ApprovalErrored || v2ApprovalSuccessful) {
      resetV2Approval();
    }
  }, [
    v2SwapSuccessful,
    v2SwapErrored,
    resetV2Approval,
    resetV2Swap,
    refreshBalance0,
    v2ApprovalSuccessful,
    v2ApprovalErrored,
  ]);

  return (
    <div className="space-y-4 p-6">
      <TokensDialog
        open={firstDialogOpen}
        onOpen={setFirstDialogOpen}
        onTokenSelected={setToken0}
        selectedTokens={[
          token0?.address ?? zeroAddress,
          token1?.address ?? zeroAddress,
        ]}
      />
      <TokensDialog
        open={secondDialogOpen}
        onOpen={setSecondDialogOpen}
        onTokenSelected={setToken1}
        selectedTokens={[
          token0?.address ?? zeroAddress,
          token1?.address ?? zeroAddress,
        ]}
      />
      <div className="relative space-y-2">
        <SwapCard
          active={activePane === 0}
          title="You Pay"
          value={String(amountIn)}
          onContainerClick={() => setActivePane(0)}
          token={token0}
          onButtonClick={() => setFirstDialogOpen(true)}
          setValue={setAmountIn}
        />
        <SwapCard
          active={activePane === 1}
          title="You Receive"
          token={token1}
          value={amountOutFormatted}
          onContainerClick={() => setActivePane(1)}
          onButtonClick={() => setSecondDialogOpen(true)}
          disabled
        />
        {/* Switch Button */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={switchTokens}
            className="group flex h-12 w-12 items-center justify-center rounded-xl border-4 border-background bg-neutral-1000 transition-all duration-200 hover:scale-110 hover:border-blue-500/50 hover:bg-neutral-950 active:scale-95"
          >
            <ArrowDown
              className="text-neutral-400 transition-all group-hover:text-blue-400 group-hover:rotate-180"
              size={20}
            />
          </button>
        </div>
      </div>
      {token1 && token0 && Number(amountIn) > 0 && (
        <SwapDetails
          token0={token0}
          token1={token1}
          amountIn={parseUnits(amountIn, token0.decimals ?? 18)}
          amountOut={v2QuoteAmountOut}
          pair={v2Pair}
        />
      )}
      <SubmitButton
        onClick={onSubmit}
        validationError={errorMessage}
        state={buttonState}
        isValid={stateValid}
      >
        {!v2RouterAllowed ? "Approve " + token0?.symbol : "Swap"}
      </SubmitButton>
    </div>
  );
}
