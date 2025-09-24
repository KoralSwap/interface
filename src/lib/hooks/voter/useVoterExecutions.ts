import * as Voter from "@/lib/abis/Voter";
import { Address, encodeFunctionData } from "viem";
import { PoolFactoryType } from "./shared";
import { CL_FACTORY, V2_FACTORY, VOTER } from "@/data/constants";
import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useCallback, useEffect, useMemo } from "react";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";

interface BaseProps {
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface CreateGaugeProps extends BaseProps {
  pool: Address;
  poolFactoryType?: PoolFactoryType;
}

function composeGaugeCreationByte(
  poolAddress: Address,
  chainId: number,
  poolFactoryType: PoolFactoryType = PoolFactoryType.V2
) {
  const poolFactory =
    poolFactoryType === PoolFactoryType.V2
      ? V2_FACTORY[chainId]
      : CL_FACTORY[chainId];
  const { abi } = Voter;
  return encodeFunctionData({
    abi,
    functionName: "createGauge",
    args: [poolFactory, poolAddress],
  });
}

function useCreateGauge({
  pool,
  poolFactoryType = PoolFactoryType.V2,
  onError,
  onSuccess,
}: CreateGaugeProps) {
  const chainId = useChainId();
  const bytes = useMemo(
    () => composeGaugeCreationByte(pool, chainId, poolFactoryType),
    [pool, chainId, poolFactoryType]
  );
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
  const execute = useCallback(
    () =>
      sendTransaction({
        data: bytes,
        to: voter,
      }),
    [sendTransaction, bytes, voter]
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

export default function useVoterExecutions() {
  return { useCreateGauge };
}
