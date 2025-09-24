import { Address, encodeFunctionData } from "viem";
import * as Voter from "@/lib/abis/Voter";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { VOTER } from "@/data/constants";
import { useCallback, useEffect, useMemo } from "react";

function composeVoteBytes(
  tokenId: bigint,
  pools: Address[],
  weights: bigint[]
) {
  const { abi } = Voter;
  return encodeFunctionData({
    abi,
    functionName: "vote",
    args: [tokenId, pools, weights],
  });
}

export default function useVote({
  tokenId,
  pools,
  weights,
  onSuccess,
  onError,
}: {
  tokenId: bigint;
  pools: Address[];
  weights: bigint[];
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}) {
  const chainId = useChainId();
  const voter = useMemo(() => VOTER[chainId], [chainId]);
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
    if (tokenId !== 0n) {
      sendTransaction({
        data: composeVoteBytes(tokenId, pools, weights),
        to: voter,
      });
    }
  }, [sendTransaction, tokenId, pools, weights, voter]);

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
