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

function composeMergeLocksBytes(tokenId0: bigint, tokenId1: bigint) {
  const { abi } = Ve;
  return encodeFunctionData({
    abi,
    functionName: "merge",
    args: [tokenId0, tokenId1],
  });
}

export default function useMergeLocks({
  tokenId1,
  tokenId0,
  onSuccess,
  onError,
}: {
  tokenId0: bigint;
  tokenId1: bigint;
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
        data: composeMergeLocksBytes(tokenId0, tokenId1),
        to: escrow,
      }),
    [sendTransaction, tokenId0, tokenId1, escrow]
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
