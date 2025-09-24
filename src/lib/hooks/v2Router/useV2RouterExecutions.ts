import { ETHER, V2_ROUTER } from "@/data/constants";
import * as V2Router from "@/lib/abis/V2Router";
import { convertETHToWETHIfApplicable } from "@/utils";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { useCallback, useEffect, useMemo } from "react";
import { Address, encodeFunctionData, zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAtomicDate } from "../useAtomicDate";
import { useAtom } from "jotai";
import { transactionDeadlineAtom } from "@/store";

interface BaseProps {
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface RemoveLPProps extends BaseProps {
  tokenA: Address;
  tokenB: Address;
  stable: boolean;
  liquidity: bigint;
}

function composeRemoveLPBytes(
  tokenA: Address,
  tokenB: Address,
  stable: boolean,
  liquidity: bigint,
  recipient: Address,
  deadline: bigint,
  chainId: number
) {
  const { abi } = V2Router;
  const isETH =
    tokenA.toLowerCase() === ETHER.toLowerCase() ||
    tokenB.toLowerCase() === ETHER.toLowerCase();

  if (isETH) {
    const token =
      tokenA.toLowerCase() !== ETHER.toLowerCase() ? tokenA : tokenB;
    return encodeFunctionData({
      abi,
      functionName: "removeLiquidityETHSupportingFeeOnTransferTokens",
      args: [token, stable, liquidity, 0n, 0n, recipient, deadline],
    });
  }

  return encodeFunctionData({
    abi,
    functionName: "removeLiquidity",
    args: [
      convertETHToWETHIfApplicable(tokenA, chainId),
      convertETHToWETHIfApplicable(tokenB, chainId),
      stable,
      liquidity,
      0n,
      0n,
      recipient,
      deadline,
    ],
  });
}

function useV2RouterRemoveLiquidity({
  tokenA,
  tokenB,
  stable,
  liquidity,
  onSuccess,
  onError,
}: RemoveLPProps) {
  const chainId = useChainId();
  const { address = zeroAddress } = useAccount();
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const now = useAtomicDate(10000);
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const bytes = useMemo(
    () =>
      composeRemoveLPBytes(
        tokenA,
        tokenB,
        stable,
        liquidity,
        address,
        deadline,
        chainId
      ),
    [address, chainId, deadline, liquidity, stable, tokenA, tokenB]
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
  const execute = useCallback(
    () =>
      sendTransaction({
        data: bytes,
        to: router,
      }),
    [sendTransaction, bytes, router]
  );

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

export default function useV2RouterExecutions() {
  return { useV2RouterRemoveLiquidity };
}
