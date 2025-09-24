import { Address, encodeFunctionData, zeroAddress } from "viem";
import * as Bribe from "@/lib/abis/Bribe";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { useCallback, useEffect } from "react";

function composeNotifyRewardBytes(token: Address, reward: bigint) {
  const { abi } = Bribe;
  return encodeFunctionData({
    abi,
    functionName: "notifyRewardAmount",
    args: [token, reward],
  });
}

export default function useIncentivize({
  bribe = zeroAddress,
  token = zeroAddress,
  reward = BigInt(0),
  onError,
  onSuccess,
}: {
  bribe?: Address;
  token?: Address;
  reward?: bigint;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}) {
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
    if (bribe !== zeroAddress && reward > 0n) {
      sendTransaction({
        data: composeNotifyRewardBytes(token, reward),
        to: bribe,
      });
    }
  }, [sendTransaction, token, reward, bribe]);

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
