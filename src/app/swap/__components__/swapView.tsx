"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TokensDialog from "@/components/shared/tokensDialog";
import { useChainId } from "wagmi";
import { useV2Swap, useV3Swap } from "../__hooks__/useSwap";
import { useV2QuoteSwap, useV3QuoteSwap } from "../__hooks__/useQuoteSwap";
import { TToken } from "@/lib/types";
import { CL_SWAP_ROUTER, STRINGS, V2_ROUTER } from "@/data/constants";
import { Address, formatUnits, parseUnits, zeroAddress } from "viem";
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
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";

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

  const { useQLGetCLPByReserveDESC } = usePoolQueries();
  // Find CL pools using descending order
  const { data: QLCLP } = useQLGetCLPByReserveDESC(1000, 30000);
  // Find CL pools that match selected tokens, and then select the best
  const bestCLPool = useMemo(() => {
    if (!QLCLP || !token0 || !token1) return undefined;
    const tokens = [
      convertETHToWETHIfApplicable(token0.address, chainId).toLowerCase(),
      convertETHToWETHIfApplicable(token1.address, chainId).toLowerCase(),
    ];
    // Filter
    const matchingPools = QLCLP.Pool.filter(
      (pool) =>
        tokens.includes(pool.token0!.address.toLowerCase()) &&
        tokens.includes(pool.token1!.address.toLowerCase())
    );
    return matchingPools
      .sort((a, b) => parseFloat(b.reserveUSD) - parseFloat(a.reserveUSD))
      .at(0);
  }, [QLCLP, token0, token1, chainId]);

  // Quote
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
  const { amountOut: v3QuoteAmountOut, routesAvailable: v3RoutesAvailable } =
    useV3QuoteSwap({
      token0: convertETHToWETHIfApplicable(
        token0?.address ?? zeroAddress,
        chainId
      ),
      token1: convertETHToWETHIfApplicable(
        token1?.address ?? zeroAddress,
        chainId
      ),
      amountIn: amountInParsed,
      refetchInterval: 30000,
      tickSpacing: Number(bestCLPool?.tickSpacing || "1"),
      sqrtPriceLimitX96: 0n,
    });

  const isV2 = useMemo(
    () => v2QuoteAmountOut > v3QuoteAmountOut,
    [v2QuoteAmountOut, v3QuoteAmountOut]
  );
  // Check pair
  const { exists: v2PairExists, pairAddress: v2Pair } = useV2CheckPair(
    token0?.address ?? zeroAddress,
    token1?.address ?? zeroAddress,
    isStable
  );
  // Router by chain ID
  const v2Router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const v3Router = useMemo(() => CL_SWAP_ROUTER[chainId], [chainId]);
  const { isAllowed: v2RouterAllowed, refresh: refreshV2Allowance } =
    useCheckAllowance(
      token0?.address ?? zeroAddress,
      v2Router,
      amountInParsed,
      10000
    );

  const { isAllowed: v3RouterAllowed, refresh: refreshV3Allowance } =
    useCheckAllowance(
      token0?.address ?? zeroAddress,
      v3Router,
      amountInParsed,
      10000
    );

  const amountOutFormatted = useMemo(
    () =>
      isV2
        ? formatUnits(v2QuoteAmountOut, token1?.decimals ?? 18)
        : formatUnits(v3QuoteAmountOut, token1?.decimals ?? 18),
    [isV2, v2QuoteAmountOut, token1?.decimals, v3QuoteAmountOut]
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

  const {
    execute: executeGrantV3Approval,
    isPending: v3ApprovalPending,
    reset: resetV3Approval,
    isError: v3ApprovalErrored,
    isSuccess: v3ApprovalSuccessful,
  } = useGrantApproval({
    token: token0?.address,
    spender: v3Router,
    amount: amountInParsed,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Approved " + token0?.symbol,
        toastType: "success",
        actionDescription: "You gave approval to spend tokens",
        hash,
      });

      void refreshV3Allowance();
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
  const {
    execute: executeV3Swap,
    isPending: v3SwapPending,
    reset: resetV3Swap,
    isError: v3SwapErrored,
    isSuccess: v3SwapSuccessful,
  } = useV3Swap({
    token0: token0?.address ?? zeroAddress,
    token1: token1?.address ?? zeroAddress,
    amountIn: amountInParsed,
    anticipatedAmountOut: v3QuoteAmountOut,
    tickSpacing: Number(bestCLPool?.tickSpacing || "1"),
    sqrtPriceLimitX96: 0n,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Swapped successfully",
        toastType: "success",
        actionDescription: "Swap was successful",
        hash,
      });

      void refreshV3Allowance();
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
    if (!v2RouterAllowed && isV2) {
      resetV2Approval();
      executeGrantV2Approval();
      return;
    }

    if (!v3RouterAllowed && !isV2) {
      resetV3Approval();
      executeGrantV3Approval();
      return;
    }

    if (isV2) executeV2Swap();
    else executeV3Swap();
  }, [
    v2RouterAllowed,
    v3RouterAllowed,
    resetV2Approval,
    resetV3Approval,
    executeGrantV2Approval,
    executeGrantV3Approval,
    executeV2Swap,
    executeV3Swap,
    isV2,
  ]);

  const { balance: balance0, refresh: refreshBalance0 } = useGetBalance(
    token0?.address,
    15000
  );
  // const { balance: balance1, refresh: refreshBalance1 } = useGetBalance(
  //   token1?.address,
  //   15000
  // );

  const buttonState = useMemo(() => {
    if (
      v2ApprovalPending ||
      v2SwapPending ||
      v3ApprovalPending ||
      v3SwapPending
    )
      return ButtonState.Loading;
    else return ButtonState.Default;
  }, [v2ApprovalPending, v3ApprovalPending, v2SwapPending, v3SwapPending]);

  const stateValid = useMemo(
    () =>
      !!token0 &&
      !!token1 &&
      (v2RoutesAvailable ||
        v2PairExists ||
        v3RoutesAvailable ||
        !!bestCLPool) &&
      (v2RouterAllowed || v3RouterAllowed
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
      v3RoutesAvailable,
      bestCLPool,
      v3RouterAllowed,
    ]
  );

  const errorMessage = useMemo(() => {
    if (!token0 || !token1) return STRINGS.UNSELECTED_TOKENS;
    if (
      !v2RoutesAvailable &&
      !v2PairExists &&
      !bestCLPool &&
      !v3RoutesAvailable
    )
      return STRINGS.SWAP_PATH_NOT_FOUND;
    if (balance0 < amountInParsed) return STRINGS.INSUFFICIENT_BALANCE;
  }, [
    balance0,
    amountInParsed,
    token0,
    token1,
    v2RoutesAvailable,
    v2PairExists,
    bestCLPool,
    v3RoutesAvailable,
  ]);

  useEffect(() => {
    if (bestCLPool) console.table(bestCLPool);
    console.log(
      isV2,
      v2RouterAllowed,
      v3RouterAllowed,
      v2QuoteAmountOut,
      v3QuoteAmountOut
    );
  }, [
    bestCLPool,
    isV2,
    v2QuoteAmountOut,
    v2RouterAllowed,
    v3QuoteAmountOut,
    v3RouterAllowed,
  ]);

  useEffect(() => {
    if (
      v2SwapSuccessful ||
      v2SwapErrored ||
      v3SwapSuccessful ||
      v3SwapErrored
    ) {
      if (isV2) resetV2Swap();
      else resetV3Swap();

      void refreshBalance0();
      return;
    }

    if (
      v2ApprovalErrored ||
      v2ApprovalSuccessful ||
      v3ApprovalSuccessful ||
      v3ApprovalErrored
    ) {
      if (isV2) resetV2Approval();
      else resetV3Approval();
    }
  }, [
    v2SwapSuccessful,
    v2SwapErrored,
    resetV2Approval,
    resetV2Swap,
    refreshBalance0,
    v2ApprovalSuccessful,
    v2ApprovalErrored,
    v3SwapSuccessful,
    v3SwapErrored,
    resetV3Swap,
    v3ApprovalSuccessful,
    v3ApprovalErrored,
    isV2,
    resetV3Approval,
  ]);

  return (
    <div className="space-y-1">
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
      <div className="space-y-1 relative">
        <SwapCard
          active={activePane === 0}
          title="Sell"
          value={String(amountIn)}
          onContainerClick={() => setActivePane(0)}
          token={token0}
          onButtonClick={() => setFirstDialogOpen(true)}
          setValue={setAmountIn}
        />
        <SwapCard
          active={activePane === 1}
          title="Buy"
          token={token1}
          value={amountOutFormatted}
          onContainerClick={() => setActivePane(1)}
          onButtonClick={() => setSecondDialogOpen(true)}
          disabled
        />
        <button
          onClick={switchTokens}
          className="h-14 flex items-center justify-center rounded-full w-14 bg-black absolute left-1/2 top-1/2 -translate-y-[calc(50%+4px)] -translate-x-1/2"
        >
          <div className="h-12 w-12 rounded-full bg-neutral-1000 flex items-center justify-center">
            <ArrowDown className="text-neutral-300" size={18} />
          </div>
        </button>
      </div>
      {token1 && token0 && Number(amountIn) > 0 && (
        <SwapDetails
          token0={token0}
          token1={token1}
          amountIn={parseUnits(amountIn, token0.decimals ?? 18)}
          amountOut={isV2 ? v2QuoteAmountOut : v3QuoteAmountOut}
          pair={
            isV2 ? v2Pair : ((bestCLPool?.address || zeroAddress) as Address)
          }
        />
      )}
      <SubmitButton
        onClick={onSubmit}
        validationError={errorMessage}
        state={buttonState}
        isValid={stateValid}
      >
        {(isV2 ? !v2RouterAllowed : !v3RouterAllowed)
          ? "Approve " + token0?.symbol
          : "Swap"}
      </SubmitButton>
    </div>
  );
}
