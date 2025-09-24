import { ETHER } from "@/data/constants";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { useCallback, useEffect, useMemo } from "react";
import { Address, encodeFunctionData, erc20Abi, zeroAddress } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

interface ApprovalProps {
  token?: Address;
  spender?: Address;
  amount?: bigint;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

function composeApprovalBytes(spender: Address, amount: bigint) {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
  });
}

export default function useGrantApproval({
  token = zeroAddress,
  spender = zeroAddress,
  amount = 0n,
  onError,
  onSuccess,
}: ApprovalProps) {
  const bytes = useMemo(
    () => composeApprovalBytes(spender, amount),
    [spender, amount]
  );
  const {
    sendTransaction,
    data: hash,
    error: sendError,
    isError: sendErrored,
    reset,
    isPending,
  } = useSendTransaction();

  const {
    isError: waitErrored,
    isLoading,
    isSuccess,
    error: waitError,
    isFetching,
  } = useWaitForTransactionReceipt({ hash });
  const execute = useCallback(() => {
    if (
      token !== zeroAddress &&
      spender !== zeroAddress &&
      amount > 0n &&
      token.toLowerCase() !== ETHER.toLowerCase()
    )
      sendTransaction({
        data: bytes,
        to: token,
      });
  }, [sendTransaction, bytes, token, spender, amount]);

  useEffect(() => {
    if (hash && onSuccess && isSuccess) {
      onSuccess(hash);
    }

    if ((sendErrored || waitErrored) && (sendError || waitError) && onError) {
      if (sendError) onError(sendError);
      if (waitError) onError(waitError);
    }
  }, [
    hash,
    onSuccess,
    sendErrored,
    waitErrored,
    sendError,
    waitError,
    onError,
    isSuccess,
  ]);
  return {
    execute,
    hash,
    isError: sendErrored || waitErrored,
    isPending: isLoading || isPending || isFetching,
    isSuccess,
    isOpen: token !== zeroAddress && spender !== zeroAddress && amount > 0n,
    reset,
  };
}
