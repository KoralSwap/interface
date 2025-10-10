import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import PoolHeader from "@/components/shared/poolHeader";
import { TPoolType } from "@/lib/types";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { convertWETHToPlainETHIfApplicable, useGetTokenInfo } from "@/utils";
import { formatUnits, parseEther } from "viem";
import { LiquidityActions, StateType } from "../../types";
import { useChainId } from "wagmi";
import { V2_ROUTER } from "@/data/constants";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import useV2RouterCalls from "@/lib/hooks/v2Router/useV2RouterCalls";
import useV2RouterExecutions from "@/lib/hooks/v2Router/useV2RouterExecutions";
import {
  KoralSwapUserPoolData,
  KoralSwapPoolData,
} from "@/lib/hooks/useKoralSwapAPI";
import useGaugeExecutions from "@/lib/hooks/gauges/useGaugeExecutions";
import { StatRow } from "./statRow";

interface Props {
  state: StateType;
  position: KoralSwapUserPoolData;
  poolData: KoralSwapPoolData | undefined;
  onOpenChange: (isOpen: boolean) => void;
}

function DialogHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="py-3 px-4 border-b border-neutral-800">
      <DialogTitle className="text-lg">
        {title} <span className="text-primary-400">Position</span>
      </DialogTitle>
      <DialogDescription>{desc}</DialogDescription>
    </div>
  );
}

function WithdrawStats({
  token0,
  token1,
  amount0,
  amount1,
  percent,
}: {
  token0: { symbol: string; decimals: number } | undefined;
  token1: { symbol: string; decimals: number } | undefined;
  amount0: bigint;
  amount1: bigint;
  percent: string;
}) {
  return (
    token0 &&
    token1 && (
      <div className="space-y-2">
        <StatRow title="Withdraw" value={String(percent) + "%"} />
        <StatRow
          title={`Withdrawing ${token0.symbol} `}
          value={formatUnits(amount0, token0.decimals ?? 18)}
          formatNum
        />
        <StatRow
          formatNum
          title={`Withdrawing ${token1.symbol} `}
          value={formatUnits(amount1, token1.decimals ?? 18)}
        />
      </div>
    )
  );
}

export default function DashboardLiquidityDialogNative({
  state,
  position,
  poolData,
  onOpenChange,
}: Props) {
  const chainId = useChainId();
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const [amount, setAmount] = useState(0n);
  const [sliderValue, setSliderValue] = useState(0);
  const { setToast } = useTransactionToastProvider();

  const token0 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(poolData?.token0 || "0x0", chainId)
  );
  const token1 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(poolData?.token1 || "0x0", chainId)
  );

  const poolType: TPoolType = poolData?.stable
    ? TPoolType.STABLE
    : TPoolType.VOLATILE;

  const { useWithdrawal } = useGaugeExecutions();
  const { useV2RouterQuoteRemoveLiquidity } = useV2RouterCalls();
  const { useV2RouterRemoveLiquidity } = useV2RouterExecutions();

  // Check allowances
  const { isAllowed: routerAllowed, refresh: refreshRouterAllowance } =
    useCheckAllowance(poolData?.pool || "0x0", router, amount, 10000);

  // Grant approvals
  const {
    execute: executeRouterApproval,
    isSuccess: routerApprovalSuccessful,
    isError: routerApprovalErrored,
    isPending: routerApprovalPending,
    reset: resetRouterApproval,
  } = useGrantApproval({
    token: poolData?.pool || "0x0",
    spender: router,
    amount,
    onSuccess: () => {
      setToast({
        actionTitle: "Approval successful",
        toastType: "success",
        actionDescription: "You can now proceed with withdrawal",
      });
      void refreshRouterAllowance();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Approval failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });

  // Unstake execution
  const {
    execute: executeWithdrawal,
    isError: withdrawalError,
    isPending: withdrawalPending,
    isSuccess: withdrawalSuccess,
    reset: resetWithdrawal,
  } = useWithdrawal({
    amountOrTokenId: amount,
    address: poolData?.gauge || "0x0",
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Withdrawal successful",
        toastType: "success",
        actionDescription: "You have successfully withdrawn from gauge",
        hash,
      });
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });

  // Quote remove liquidity
  const { amount0: removedAmount0, amount1: removedAmount1 } =
    useV2RouterQuoteRemoveLiquidity(
      poolData?.token0 || "0x0",
      poolData?.token1 || "0x0",
      poolData?.stable || false,
      amount
    );

  // Remove liquidity execution
  const {
    execute: executeLPRemoval,
    isError: lpRemovalError,
    isPending: lpRemovalPending,
    isSuccess: lpRemovalSuccess,
    reset: resetLPRemoval,
  } = useV2RouterRemoveLiquidity({
    tokenA: convertWETHToPlainETHIfApplicable(poolData?.token0 || "0x0"),
    tokenB: convertWETHToPlainETHIfApplicable(poolData?.token1 || "0x0"),
    stable: poolData?.stable || false,
    liquidity: amount,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Liquidity successfully removed",
        toastType: "success",
        actionDescription: "You have successfully removed liquidity",
        hash,
      });
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });

  const [amountOut0, amountOut1] = useMemo(() => {
    if (state.actionType === LiquidityActions.Unstake) {
      const percentage = Number(sliderValue) / 100;
      const unstakeAmount0 =
        Number(formatUnits(position.token0Amount, token0?.decimals || 18)) *
        percentage;
      const unstakeAmount1 =
        Number(formatUnits(position.token1Amount, token1?.decimals || 18)) *
        percentage;
      return [
        BigInt(Math.floor(unstakeAmount0 * 10 ** (token0?.decimals || 18))),
        BigInt(Math.floor(unstakeAmount1 * 10 ** (token1?.decimals || 18))),
      ];
    } else if (state.actionType === LiquidityActions.Withdraw) {
      return [removedAmount0, removedAmount1];
    }
    return [0n, 0n];
  }, [
    state.actionType,
    sliderValue,
    position,
    removedAmount0,
    removedAmount1,
    token0,
    token1,
  ]);

  const isValid = useMemo(() => {
    return amount > 0n && sliderValue > 0;
  }, [amount, sliderValue]);

  const onSubmit = useCallback(() => {
    if (!isValid) return;

    switch (state.actionType) {
      case LiquidityActions.Unstake: {
        executeWithdrawal?.();
        break;
      }
      case LiquidityActions.Withdraw: {
        if (!routerAllowed) {
          executeRouterApproval?.();
        } else {
          executeLPRemoval?.();
        }
        break;
      }
    }
  }, [
    state.actionType,
    isValid,
    routerAllowed,
    executeWithdrawal,
    executeRouterApproval,
    executeLPRemoval,
  ]);

  const buttonState: ButtonState = useMemo(() => {
    switch (state.actionType) {
      case LiquidityActions.Unstake: {
        return withdrawalPending ? ButtonState.Loading : ButtonState.Default;
      }
      case LiquidityActions.Withdraw: {
        return !routerAllowed
          ? ButtonState.Approve
          : routerApprovalPending || lpRemovalPending
            ? ButtonState.Loading
            : ButtonState.Default;
      }
      default:
        return ButtonState.Default;
    }
  }, [
    state.actionType,
    withdrawalPending,
    routerAllowed,
    routerApprovalPending,
    lpRemovalPending,
  ]);

  const buttonChild = useMemo(() => {
    switch (state.actionType) {
      case LiquidityActions.Unstake: {
        return "Unstake";
      }
      case LiquidityActions.Withdraw: {
        return buttonState !== ButtonState.Approve
          ? "Withdraw"
          : "Approve to spend LPs";
      }
    }
  }, [state.actionType, buttonState]);

  const header = useMemo(() => {
    switch (state.actionType) {
      case LiquidityActions.Unstake:
        return (
          <DialogHeader
            title="Unstake your"
            desc="Unstake your position from the gauge"
          />
        );
      case LiquidityActions.Withdraw:
        return (
          <DialogHeader
            title="Withdraw your"
            desc="Withdraw your liquidity position"
          />
        );
    }
  }, [state.actionType]);

  useEffect(() => {
    if (routerApprovalSuccessful || routerApprovalErrored)
      resetRouterApproval();
    if (withdrawalSuccess || withdrawalError) resetWithdrawal();
    if (lpRemovalSuccess || lpRemovalError) resetLPRemoval();
  }, [
    routerApprovalSuccessful,
    routerApprovalErrored,
    resetRouterApproval,
    withdrawalSuccess,
    withdrawalError,
    resetWithdrawal,
    lpRemovalSuccess,
    lpRemovalError,
    resetLPRemoval,
  ]);

  return (
    <Dialog open={state.dialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-[520px]">
        <div>
          {header}

          <div className="space-y-6 p-4 border-b border-neutral-800">
            <PoolHeader
              token0={token0}
              token1={token1}
              poolAddress={poolData?.pool || "0x0"}
              poolType={poolType}
            />
            <Slider
              value={[sliderValue]}
              onValueChange={([value]) => {
                setSliderValue(value);
                const maxAmount =
                  state.actionType === LiquidityActions.Unstake
                    ? position.stakedInGauge
                    : position.liquidity;
                const calc = (value * Number(formatUnits(maxAmount, 18))) / 100;
                setAmount(parseEther(calc.toString()));
              }}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex justify-between">
              <span>Min</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>Max</span>
            </div>
            {state.actionType === LiquidityActions.Withdraw && (
              <WithdrawStats
                token0={token0}
                token1={token1}
                percent={String(sliderValue)}
                amount0={amountOut0}
                amount1={amountOut1}
              />
            )}
            {state.actionType === LiquidityActions.Unstake && (
              <div className="space-y-2">
                <StatRow title="Unstake" value={String(sliderValue) + "%"} />
                <StatRow
                  title={`Unstaking ${token0?.symbol} `}
                  value={formatUnits(amountOut0, token0?.decimals ?? 18)}
                  formatNum
                />
                <StatRow
                  formatNum
                  title={`Unstaking ${token1?.symbol} `}
                  value={formatUnits(amountOut1, token1?.decimals ?? 18)}
                />
              </div>
            )}
          </div>
          <div className="p-4">
            <SubmitButton
              onClick={onSubmit}
              isValid={isValid}
              state={buttonState}
            >
              {buttonChild}
            </SubmitButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
