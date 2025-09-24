import { Address, encodeFunctionData, zeroAddress } from "viem";
import { GaugeType } from "./shared";
import * as V2Gauge from "@/lib/abis/V2Gauge";
import * as CLGauge from "@/lib/abis/CLGauge";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useCallback, useEffect, useMemo } from "react";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";

interface BaseActionsProps {
  amountOrTokenId: bigint;
  address?: Address;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface GetRewardProps extends Omit<BaseActionsProps, "amountOrTokenId"> {
  gaugeType?: GaugeType;
  tokenId?: bigint;
}

function composeDepositBytes(amountOrTokenId: bigint) {
  const { abi } = V2Gauge; // One ABI is enough since the function signatures are similar
  return encodeFunctionData({
    abi,
    functionName: "deposit",
    args: [amountOrTokenId],
  });
}

function composeWithdrawBytes(amountOrTokenId: bigint) {
  const { abi } = V2Gauge; // One ABI is enough since the function signatures are similar
  return encodeFunctionData({
    abi,
    functionName: "withdraw",
    args: [amountOrTokenId],
  });
}

function composeGetRewardBytes(
  addressOrTokenId: Address | bigint,
  gaugeType: GaugeType = GaugeType.V2
) {
  if (gaugeType === GaugeType.V2 && typeof addressOrTokenId !== "bigint") {
    const { abi } = V2Gauge;
    return encodeFunctionData({
      abi,
      functionName: "getReward",
      args: [addressOrTokenId],
    });
  } else {
    const { abi } = CLGauge;
    return encodeFunctionData({
      abi,
      functionName: "getReward",
      args: [addressOrTokenId],
    });
  }
}

function useDeposit({
  amountOrTokenId,
  address = zeroAddress,
  onSuccess,
  onError,
}: BaseActionsProps) {
  const bytes = useMemo(
    () => composeDepositBytes(amountOrTokenId),
    [amountOrTokenId]
  );
  const {
    sendTransaction,
    data: hash,
    error: sendError,
    isError: sendErrored,
    reset,
  } = useSendTransaction();

  const {
    isError: waitErrored,
    isLoading: isPending,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({ hash });
  const execute = useCallback(() => {
    if (address !== zeroAddress)
      sendTransaction({
        data: bytes,
        to: address,
      });
  }, [sendTransaction, bytes, address]);

  useEffect(() => {
    if (isSuccess && hash && onSuccess) {
      onSuccess(hash);
    }

    if ((sendErrored || waitErrored) && (sendError || waitError) && onError) {
      if (sendError) onError(sendError);
      if (waitError) onError(waitError);
    }
  }, [
    isSuccess,
    hash,
    onSuccess,
    sendErrored,
    waitErrored,
    sendError,
    waitError,
    onError,
  ]);
  return {
    execute,
    hash,
    isError: sendErrored || waitErrored,
    isPending,
    isSuccess,
    reset,
  };
}

function useWithdrawal({
  amountOrTokenId,
  address = zeroAddress,
  onSuccess,
  onError,
}: BaseActionsProps) {
  const bytes = useMemo(
    () => composeWithdrawBytes(amountOrTokenId),
    [amountOrTokenId]
  );
  const {
    sendTransaction,
    data: hash,
    error: sendError,
    isError: sendErrored,
    reset,
  } = useSendTransaction();

  const {
    isError: waitErrored,
    isLoading: isPending,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({ hash });
  const execute = useCallback(() => {
    if (address !== zeroAddress)
      sendTransaction({
        data: bytes,
        to: address,
      });
  }, [sendTransaction, bytes, address]);

  useEffect(() => {
    if (isSuccess && hash && onSuccess) {
      onSuccess(hash);
    }

    if ((sendErrored || waitErrored) && (sendError || waitError) && onError) {
      if (sendError) onError(sendError);
      if (waitError) onError(waitError);
    }
  }, [
    isSuccess,
    hash,
    onSuccess,
    sendErrored,
    waitErrored,
    sendError,
    waitError,
    onError,
  ]);
  return {
    execute,
    hash,
    isError: sendErrored || waitErrored,
    isPending,
    isSuccess,
    reset,
  };
}

function useGetReward({
  gaugeType,
  tokenId = 0n,
  address = zeroAddress,
  onSuccess,
  onError,
}: GetRewardProps) {
  const { address: account = zeroAddress } = useAccount();
  const bytes = useMemo(
    () =>
      gaugeType === GaugeType.V2
        ? composeGetRewardBytes(account, gaugeType)
        : composeGetRewardBytes(tokenId, gaugeType),
    [account, gaugeType, tokenId]
  );
  const {
    sendTransaction,
    data: hash,
    error: sendError,
    isError: sendErrored,
    reset,
  } = useSendTransaction();

  const {
    isError: waitErrored,
    isLoading: isPending,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({ hash });
  const execute = useCallback(() => {
    if (address !== zeroAddress)
      sendTransaction({
        data: bytes,
        to: address,
      });
  }, [sendTransaction, bytes, address]);

  useEffect(() => {
    if (isSuccess && hash && onSuccess) {
      onSuccess(hash);
    }

    if ((sendErrored || waitErrored) && (sendError || waitError) && onError) {
      if (sendError) onError(sendError);
      if (waitError) onError(waitError);
    }
  }, [
    isSuccess,
    hash,
    onSuccess,
    sendErrored,
    waitErrored,
    sendError,
    waitError,
    onError,
  ]);
  return {
    execute,
    hash,
    isError: sendErrored || waitErrored,
    isPending,
    isSuccess,
    reset,
  };
}

export default function useGaugeExecutions() {
  return { useDeposit, useWithdrawal, useGetReward };
}
