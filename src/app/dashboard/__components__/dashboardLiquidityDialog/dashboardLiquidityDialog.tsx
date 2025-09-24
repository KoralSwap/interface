import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import EstimatesHeader from "@/app/lock/estimateHeader";
import PoolHeader from "@/components/shared/poolHeader";
import { TPoolType } from "@/lib/types";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { convertWETHToPlainETHIfApplicable, useGetTokenInfo } from "@/utils";
import { useGetHeader } from "./dialogHeaders";
import { getAddress, parseEther, parseUnits, zeroAddress } from "viem";
import { LiquidityActions, StateType } from "../../types";
import { useChainId } from "wagmi";
import { V2_ROUTER } from "@/data/constants";
import StakeStats from "./stakeStat";
import WithdrawStats from "./withdrawStats";
import useVoterExecutions from "@/lib/hooks/voter/useVoterExecutions";
import { LiquidityPosition } from "@/gql/graphql";
import { PoolFactoryType } from "@/lib/hooks/voter/shared";
import useVoterCalls from "@/lib/hooks/voter/useVoterCalls";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import useGaugeExecutions from "@/lib/hooks/gauges/useGaugeExecutions";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import usePositionExecutions from "@/lib/hooks/positions/usePositionExecutions";
import usePositionCalls from "@/lib/hooks/positions/usePositionCalls";
import useV2RouterCalls from "@/lib/hooks/v2Router/useV2RouterCalls";
import useV2RouterExecutions from "@/lib/hooks/v2Router/useV2RouterExecutions";
import useGaugeQueries from "@/lib/hooks/envio/useGaugeQueries";

interface Props {
  state: StateType;
  position: LiquidityPosition;
  onOpenChange: (isOpen: boolean) => void;
  onTransactionCompleted?: () => void;
}

export default function DashboardLiquidityDialog({
  state,
  position,
  onOpenChange,
  onTransactionCompleted,
}: Props) {
  const header = useGetHeader({ state });
  const chainId = useChainId();
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const [amount, setAmount] = useState(0n);
  const isV3 = useMemo(
    () => position.pool!.poolType.toLowerCase() === "concentrated",
    [position.pool]
  );
  const [sliderValue, setSliderValue] = useState(0);
  const token0 = useGetTokenInfo(getAddress(position.pool!.token0!.address));
  const token1 = useGetTokenInfo(getAddress(position.pool!.token1!.address));
  const { setToast } = useTransactionToastProvider();
  const { useGaugeForPool } = useVoterCalls();
  const { useDeposit, useWithdrawal } = useGaugeExecutions();
  const { usePositionSetApproval, usePositionDecreaseLiquidity } =
    usePositionExecutions();
  const { usePositionCheckAllowance, usePositionQuoteDecreaseLiquidity } =
    usePositionCalls();
  const { useV2RouterQuoteRemoveLiquidity } = useV2RouterCalls();
  const { useV2RouterRemoveLiquidity } = useV2RouterExecutions();
  const { useQLGetAllGaugePositions } = useGaugeQueries();
  const { data: QLGaugePositions, refetch: refetchQLGaugePositions } =
    useQLGetAllGaugePositions(1000, 30000);
  const { gauge: gaugeAddress, refetch: refetchGaugeAddress } = useGaugeForPool(
    { pool: getAddress(position.pool!.address), refetchInterval: 10000 }
  );

  // Find matching gauge position
  const GP = useMemo(() => {
    if (!QLGaugePositions) return;
    const matchGP = QLGaugePositions.GaugePosition.find(
      (gp) => gp.gauge!.address.toLowerCase() === gaugeAddress.toLowerCase()
    );
    return matchGP;
  }, [QLGaugePositions, gaugeAddress]);

  const { useCreateGauge } = useVoterExecutions();
  const {
    isAllowed: gaugePositionAllowed,
    refetch: refreshGaugePositionAllowance,
  } = usePositionCheckAllowance({
    tokenId: position.clPositionTokenId
      ? BigInt(position.clPositionTokenId)
      : undefined,
    spender: gaugeAddress,
    refetchInterval: 30000,
  });
  const { isAllowed: gaugeAllowed, refresh: refreshGaugeAllowance } =
    useCheckAllowance(
      getAddress(position.pool!.address),
      gaugeAddress,
      amount,
      10000
    );
  const { isAllowed: routerAllowed, refresh: refreshRouterAllowance } =
    useCheckAllowance(
      getAddress(position.pool!.address),
      router,
      amount,
      10000
    );
  const {
    execute: executeSetApprovalForPosition,
    isPending: setApprovalPending,
    reset: resetSetApproval,
    isError: setApprovalErrored,
    isSuccess: setApprovalSuccessful,
  } = usePositionSetApproval({
    tokenId: position.clPositionTokenId
      ? BigInt(position.clPositionTokenId)
      : 0n,
    spender: gaugeAddress,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Approved vault to spend your LP",
        toastType: "success",
        actionDescription: "You gave approval to spend tokens",
        hash,
      });

      void refreshGaugePositionAllowance();
    },
    onError: (err) =>
      setToast({
        toastType: "error",
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });
  const {
    execute: executeGrantRouterApproval,
    isPending: routerApprovalPending,
    reset: resetRouterApproval,
    isError: routerApprovalErrored,
    isSuccess: routerApprovalSuccessful,
  } = useGrantApproval({
    token: getAddress(position.pool!.address),
    spender: router,
    amount: amount,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Approved router to spend your LP",
        toastType: "success",
        actionDescription: "You gave approval to spend tokens",
        hash,
      });

      void refreshRouterAllowance();
    },
    onError: (err) =>
      setToast({
        toastType: "error",
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });
  const {
    execute: executeGrantGaugeApproval,
    isPending: gaugeApprovalPending,
    reset: resetGaugeApproval,
    isError: gaugeApprovalErrored,
    isSuccess: gaugeApprovalSuccessful,
  } = useGrantApproval({
    token: getAddress(position.pool!.address),
    spender: gaugeAddress,
    amount: amount,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Approved vault to spend your LP",
        toastType: "success",
        actionDescription: "You gave approval to spend tokens",
        hash,
      });

      void refreshGaugeAllowance();
    },
    onError: (err) =>
      setToast({
        toastType: "error",
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });
  const {
    execute: executeGaugeCreation,
    isError: gaugeCreationError,
    isPending: gaugeCreationPending,
    isSuccess: gaugeCreationSuccess,
    reset: resetGaugeCreation,
  } = useCreateGauge({
    pool: getAddress(position.pool!.address),
    poolFactoryType: isV3 ? PoolFactoryType.CL : PoolFactoryType.V2,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Vault has been created",
        toastType: "success",
        actionDescription: "You have successfully created vault",
        hash,
      });
      void refetchGaugeAddress();
      void refetchQLGaugePositions();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });
  const {
    execute: executeDeposit,
    isError: depositError,
    isPending: depositPending,
    isSuccess: depositSuccess,
    reset: resetDeposit,
  } = useDeposit({
    amountOrTokenId: isV3 ? BigInt(position.clPositionTokenId || 0) : amount,
    address: gaugeAddress,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Deposit successful",
        toastType: "success",
        actionDescription: "You have successfully deposited into vault",
        hash,
      });

      void refetchQLGaugePositions();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });
  const {
    execute: executeWithdrawal,
    isError: withdrawalError,
    isPending: withdrawalPending,
    isSuccess: withdrawalSuccess,
    reset: resetWithdrawal,
  } = useWithdrawal({
    amountOrTokenId: isV3 ? BigInt(position.clPositionTokenId || 0) : amount,
    address: gaugeAddress,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Withdrawal successful",
        toastType: "success",
        actionDescription: "You have successfully withdrawn from vault",
        hash,
      });
      void refetchQLGaugePositions();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });

  const { amount0: removedAmount0V2, amount1: removedAmount1V2 } =
    useV2RouterQuoteRemoveLiquidity(
      getAddress(position.pool!.token0!.address),
      getAddress(position.pool!.token1!.address),
      position.pool!.poolType === "STABLE",
      !isV3 ? amount : 0n
    );
  const { amount0: removedAmount0V3, amount1: removedAmount1V3 } =
    usePositionQuoteDecreaseLiquidity({
      tokenId: isV3 ? BigInt(position.clPositionTokenId) : 0n,
      liquidity: isV3 ? amount : 0n,
    });

  const {
    execute: executeLPRemovalV2,
    isError: lpRemovalV2Error,
    isPending: lpRemovalV2Pending,
    isSuccess: lpRemovalV2Success,
    reset: resetLPRemovalV2,
  } = useV2RouterRemoveLiquidity({
    tokenA: convertWETHToPlainETHIfApplicable(
      getAddress(position.pool!.token0!.address)
    ),
    tokenB: convertWETHToPlainETHIfApplicable(
      getAddress(position.pool!.token1!.address)
    ),
    stable: position.pool!.poolType === "STABLE",
    liquidity: !isV3 ? amount : 0n,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Liquidity successfully removed",
        toastType: "success",
        actionDescription: "You have successfully removed liquidity",
        hash,
      });
      // void refetchGaugeAddress();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });
  const {
    execute: executeLPRemovalV3,
    isError: lpRemovalV3Error,
    isPending: lpRemovalV3Pending,
    isSuccess: lpRemovalV3Success,
    reset: resetLPRemovalV3,
  } = usePositionDecreaseLiquidity({
    tokenId: position.clPositionTokenId
      ? BigInt(position.clPositionTokenId)
      : 0n,
    liquidity: amount,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Liquidity successfully removed",
        toastType: "success",
        actionDescription: "You have successfully removed liquidity",
        hash,
      });
      // void refetchGaugeAddress();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        toastType: "error",
        actionDescription: "",
      }),
  });

  const [amountOut0, amountOut1] = useMemo(() => {
    if (state.actionType === LiquidityActions.Stake) {
      const poolReserve0 = Number(position.pool!.reserve0);
      const poolReserve1 = Number(position.pool!.reserve1);
      const userPosition = Number(position.position);
      const totalSupply = Number(position.pool!.totalSupply);
      const lpPercentage = totalSupply > 0 ? userPosition / totalSupply : 0;
      const deposit0 = lpPercentage * poolReserve0;
      const deposit1 = lpPercentage * poolReserve1;
      return [
        parseUnits(deposit0.toString(), token0?.decimals ?? 18),
        parseUnits(deposit1.toString(), token1?.decimals ?? 18),
      ];
    } else if (state.actionType === LiquidityActions.Unstake) {
      const poolReserve0 = Number(position.pool!.reserve0);
      const poolReserve1 = Number(position.pool!.reserve1);
      const userPosition = Number(GP?.amountDeposited || "0");
      const totalSupply = Number(position.pool!.totalSupply);
      const lpPercentage = totalSupply > 0 ? userPosition / totalSupply : 0;
      const deposit0 = lpPercentage * poolReserve0;
      const deposit1 = lpPercentage * poolReserve1;
      return [
        parseUnits(deposit0.toString(), token0?.decimals ?? 18),
        parseUnits(deposit1.toString(), token1?.decimals ?? 18),
      ];
    }
    return (
      isV3
        ? [removedAmount0V3, removedAmount1V3]
        : [removedAmount0V2, removedAmount1V2]
    ) as [bigint, bigint];
  }, [
    GP?.amountDeposited,
    isV3,
    position.pool,
    position.position,
    removedAmount0V2,
    removedAmount0V3,
    removedAmount1V2,
    removedAmount1V3,
    state.actionType,
    token0?.decimals,
    token1?.decimals,
  ]);

  const isValid = useMemo(() => (!isV3 ? amount > 0n : true), [amount, isV3]);

  const onSubmit = useCallback(() => {
    // Reset first
    resetDeposit();
    resetGaugeApproval();
    resetGaugeCreation();
    resetSetApproval();
    resetWithdrawal();
    resetLPRemovalV2();
    resetLPRemovalV3();

    switch (state.actionType) {
      case LiquidityActions.Stake: {
        if (gaugeAddress === zeroAddress) {
          executeGaugeCreation();
        } else {
          if (isV3 && !gaugePositionAllowed) executeSetApprovalForPosition();
          else if (!isV3 && !gaugeAllowed) executeGrantGaugeApproval();
          else executeDeposit();
        }
        break;
      }
      case LiquidityActions.Unstake: {
        executeWithdrawal();
        break;
      }
      case LiquidityActions.Withdraw: {
        if (!isV3) {
          if (!routerAllowed) executeGrantRouterApproval();
          else {
            executeLPRemovalV2();
          }
        } else {
          executeLPRemovalV3();
        }
        break;
      }
    }

    if (onTransactionCompleted) onTransactionCompleted();
  }, [
    resetDeposit,
    resetGaugeApproval,
    resetGaugeCreation,
    resetSetApproval,
    resetWithdrawal,
    resetLPRemovalV2,
    resetLPRemovalV3,
    state.actionType,
    onTransactionCompleted,
    gaugeAddress,
    executeGaugeCreation,
    gaugeAllowed,
    gaugePositionAllowed,
    executeDeposit,
    isV3,
    executeSetApprovalForPosition,
    executeGrantGaugeApproval,
    executeWithdrawal,
    routerAllowed,
    executeGrantRouterApproval,
    executeLPRemovalV2,
    executeLPRemovalV3,
  ]);

  const buttonState = useMemo(() => {
    switch (state.actionType) {
      case LiquidityActions.Stake: {
        return gaugeApprovalPending ||
          gaugeCreationPending ||
          depositPending ||
          setApprovalPending ||
          withdrawalPending
          ? ButtonState.Loading
          : (!isV3 && !gaugeAllowed) || (isV3 && !gaugePositionAllowed)
            ? ButtonState.Approve
            : ButtonState.Default;
      }
      case LiquidityActions.Unstake: {
        return withdrawalPending ? ButtonState.Loading : ButtonState.Default;
      }
      case LiquidityActions.Withdraw: {
        return !routerAllowed
          ? ButtonState.Approve
          : routerApprovalPending || lpRemovalV3Pending || lpRemovalV2Pending
            ? ButtonState.Loading
            : ButtonState.Default;
      }
    }
  }, [
    depositPending,
    gaugeAllowed,
    gaugeApprovalPending,
    gaugeCreationPending,
    gaugePositionAllowed,
    isV3,
    lpRemovalV2Pending,
    lpRemovalV3Pending,
    routerAllowed,
    routerApprovalPending,
    setApprovalPending,
    state.actionType,
    withdrawalPending,
  ]);

  const buttonChild = useMemo(() => {
    switch (state.actionType) {
      case LiquidityActions.Stake: {
        return gaugeAddress !== zeroAddress
          ? buttonState !== ButtonState.Approve
            ? "Stake"
            : "Approve to spend LPs"
          : "Create Vault";
      }
      case LiquidityActions.Unstake: {
        return "Unstake";
      }
      case LiquidityActions.Withdraw: {
        return buttonState !== ButtonState.Approve || isV3
          ? "Withdraw"
          : "Approve to spend LPs";
      }
    }
  }, [state.actionType, gaugeAddress, buttonState, isV3]);

  useEffect(() => {
    if (setApprovalSuccessful || setApprovalErrored) resetSetApproval();
    if (routerApprovalSuccessful || routerApprovalErrored)
      resetRouterApproval();
    if (gaugeApprovalSuccessful || gaugeApprovalErrored) resetGaugeApproval();
    if (gaugeCreationSuccess || gaugeCreationError) resetGaugeCreation();
    if (withdrawalSuccess || withdrawalError) resetWithdrawal();
    if (depositSuccess || depositError) resetDeposit();
    if (lpRemovalV2Success || lpRemovalV2Error) resetLPRemovalV2();
    if (lpRemovalV3Success || lpRemovalV3Error) resetLPRemovalV3();
  }, [
    resetRouterApproval,
    resetGaugeApproval,
    setApprovalSuccessful,
    setApprovalErrored,
    resetSetApproval,
    routerApprovalSuccessful,
    routerApprovalErrored,
    gaugeApprovalSuccessful,
    gaugeApprovalErrored,
    gaugeCreationSuccess,
    gaugeCreationError,
    resetGaugeCreation,
    withdrawalSuccess,
    withdrawalError,
    resetWithdrawal,
    depositSuccess,
    depositError,
    resetDeposit,
    lpRemovalV2Success,
    lpRemovalV2Error,
    resetLPRemovalV2,
    lpRemovalV3Success,
    lpRemovalV3Error,
    resetLPRemovalV3,
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
              poolAddress={getAddress(position.pool!.address)}
              poolType={
                position.pool!.poolType === "STABLE"
                  ? TPoolType.STABLE
                  : position.pool!.poolType === "VOLATILE"
                    ? TPoolType.VOLATILE
                    : TPoolType.CONCENTRATED
              }
            />
            <Slider
              value={
                !isV3 || state.actionType === LiquidityActions.Withdraw
                  ? [sliderValue]
                  : [0]
              }
              disabled={isV3 && state.actionType !== LiquidityActions.Withdraw}
              onValueChange={([value]) => {
                setSliderValue(value);
                // console.log(position.position);
                const calc =
                  state.actionType === LiquidityActions.Stake ||
                  state.actionType === LiquidityActions.Withdraw
                    ? (value * parseFloat(position.position)) / 100
                    : (value * parseFloat(GP?.amountDeposited || "0")) / 100;
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
            <EstimatesHeader />
            {state.actionType === LiquidityActions.Withdraw && (
              <WithdrawStats
                token0={token0}
                token1={token1}
                percent={String(sliderValue)}
                amount0={amountOut0}
                amount1={amountOut1}
              />
            )}
            {(state.actionType === LiquidityActions.Stake ||
              state.actionType === LiquidityActions.Unstake) && (
              <StakeStats
                action={
                  state.actionType === LiquidityActions.Stake
                    ? "stake"
                    : "unstake"
                }
                token0={token0}
                token1={token1}
                percent={String(sliderValue)}
                balance0={amountOut0}
                balance1={amountOut1}
                tokenId={isV3 ? BigInt(position.clPositionTokenId) : undefined}
              />
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
