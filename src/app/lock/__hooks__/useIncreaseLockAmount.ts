import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import * as Ve from "@/lib/abis/Ve";
import { useCallback, useEffect, useMemo } from "react";
import { VE } from "@/data/constants";
import { encodeFunctionData } from "viem";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";

function composeLockIncreaseAmountBytes(tokenId: bigint, value: bigint) {
  const { abi } = Ve;
  return encodeFunctionData({
    abi,
    functionName: "increaseAmount",
    args: [tokenId, value],
  });
}

export default function useIncreaseLockAmount({
  value,
  tokenId,
  onSuccess,
  onError,
}: {
  tokenId: bigint;
  value: bigint;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}) {
  const chainId = useChainId();
  const escrow = useMemo(() => VE[chainId], [chainId]);
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
        data: composeLockIncreaseAmountBytes(tokenId, value),
        to: escrow,
      }),
    [sendTransaction, tokenId, value, escrow]
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
