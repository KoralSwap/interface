import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import * as Ve from "@/lib/abis/Ve";
import { useCallback, useEffect, useMemo } from "react";
import { VE } from "@/data/constants";
import { Address, encodeFunctionData, zeroAddress } from "viem";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";

function composeTransferLockBytes(from: Address, to: Address, tokenId: bigint) {
  const { abi } = Ve;
  return encodeFunctionData({
    abi,
    functionName: "safeTransferFrom",
    args: [from, to, tokenId],
  });
}

export default function useTransferLock({
  to,
  tokenId,
  onSuccess,
  onError,
}: {
  to: Address;
  tokenId: bigint;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}) {
  const chainId = useChainId();
  const { address = zeroAddress } = useAccount();
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
        data: composeTransferLockBytes(address, to, tokenId),
        to: escrow,
      }),
    [sendTransaction, address, to, tokenId, escrow]
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
