import { DISTRIBUTOR } from "@/data/constants";
import * as RD from "@/lib/abis/RewardsDistributor";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { useCallback, useEffect, useMemo } from "react";
import { encodeFunctionData } from "viem";
import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

interface BaseActionsProps {
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface SingleClaimAction extends BaseActionsProps {
  tokenId: bigint;
}

interface ManyClaimsAction extends BaseActionsProps {
  tokenIds: bigint[];
}

function composeSingleClaimBytes(tokenId: bigint) {
  const { abi } = RD;
  return encodeFunctionData({ abi, functionName: "claim", args: [tokenId] });
}

function composeManyClaimsBytes(tokenIds: bigint[]) {
  const { abi } = RD;
  return encodeFunctionData({
    abi,
    functionName: "claimMany",
    args: [tokenIds],
  });
}

function useClaimForSingle({ tokenId, onSuccess, onError }: SingleClaimAction) {
  const chainId = useChainId();
  const dist = useMemo(() => DISTRIBUTOR[chainId], [chainId]);
  const bytes = useMemo(() => composeSingleClaimBytes(tokenId), [tokenId]);
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
        to: dist,
      }),
    [sendTransaction, bytes, dist]
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
function useClaimForMany({ tokenIds, onSuccess, onError }: ManyClaimsAction) {
  const chainId = useChainId();
  const dist = useMemo(() => DISTRIBUTOR[chainId], [chainId]);
  const bytes = useMemo(() => composeManyClaimsBytes(tokenIds), [tokenIds]);
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
        to: dist,
      }),
    [sendTransaction, bytes, dist]
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

export default function useDistributorExecutions() {
  return { useClaimForSingle, useClaimForMany };
}
