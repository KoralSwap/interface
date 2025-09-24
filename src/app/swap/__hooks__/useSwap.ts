import { Address, encodeFunctionData, zeroAddress } from "viem";
import { deriveV2SwapRoutes, deriveV3SwapParams, SwapFlow } from "./shared";
import {
  CL_SWAP_FEE_RECIPIENT,
  CL_SWAP_ROUTER,
  ETHER,
  HUNDRED_PERCENT_BN,
  V2_ROUTER,
} from "@/data/constants";
import * as V2Router from "@/lib/abis/V2Router";
import * as V3Router from "@/lib/abis/V3Router";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { useCallback, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { multiHopsAtom, slippageAtom, transactionDeadlineAtom } from "@/store";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { convertETHToWETHIfApplicable } from "@/utils";

interface BaseProps {
  token0: Address;
  token1: Address;
  anticipatedAmountOut?: bigint;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface V2SwapProps extends BaseProps {
  amountIn: bigint;
  stable: boolean;
}

interface V3SwapProps extends BaseProps {
  tickSpacing: number;
  sqrtPriceLimitX96: bigint;
  amountIn: bigint;
}

function composeV2SwapBytes(
  from: Address,
  to: Address,
  amountIn: bigint,
  recipient: Address,
  deadline: bigint,
  stable: boolean,
  chainId: number,
  isMultipath: boolean = false,
  amountOutMin: bigint = 0n
) {
  const routes = deriveV2SwapRoutes(from, to, stable, chainId, isMultipath);
  const isETHSwap =
    from.toLowerCase() === ETHER.toLowerCase() ||
    to.toLowerCase() === ETHER.toLowerCase();
  const swapFlow =
    isETHSwap && from.toLowerCase() === ETHER.toLowerCase()
      ? SwapFlow.FROM_ETHER
      : isETHSwap && to.toLowerCase() === ETHER.toLowerCase()
        ? SwapFlow.TO_ETHER
        : SwapFlow.BETWEEN_ERC20;
  const { abi } = V2Router;

  if (isETHSwap) {
    return swapFlow === SwapFlow.FROM_ETHER
      ? {
          value: amountIn,
          bytes: encodeFunctionData({
            abi,
            functionName: "swapExactETHForTokensSupportingFeeOnTransferTokens",
            args: [amountOutMin, routes, recipient, deadline],
          }),
        }
      : {
          value: undefined,
          bytes: encodeFunctionData({
            abi,
            functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
            args: [amountIn, amountOutMin, routes, recipient, deadline],
          }),
        };
  }

  return {
    value: undefined,
    bytes: encodeFunctionData({
      abi,
      functionName: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
      args: [amountIn, amountOutMin, routes, recipient, deadline],
    }),
  };
}

function composeV3SwapBytes(
  from: Address,
  to: Address,
  tickSpacing: number,
  amountIn: bigint,
  recipient: Address,
  sqrtPriceLimitX96: bigint,
  deadline: bigint,
  chainId: number,
  isMultipath: boolean = false,
  amountOutMin: bigint = 0n
) {
  const { abi } = V3Router;
  const swapRouter = CL_SWAP_ROUTER[chainId]; // First recipient
  const feeRecipient = CL_SWAP_FEE_RECIPIENT[chainId]; // Fee recipient
  const derivedParams = deriveV3SwapParams(
    from,
    to,
    swapRouter,
    tickSpacing,
    sqrtPriceLimitX96,
    amountIn,
    chainId,
    deadline,
    amountOutMin,
    isMultipath
  );
  const exactInputBytes = derivedParams.isMultipath
    ? encodeFunctionData({
        abi,
        functionName: "exactInput",
        args: [derivedParams.params],
      })
    : encodeFunctionData({
        abi,
        functionName: "exactInputSingle",
        args: [derivedParams.params],
      });
  const sweepTokenBytes = encodeFunctionData({
    abi,
    functionName: "sweepTokenWithFee",
    args: [
      convertETHToWETHIfApplicable(to, chainId),
      amountOutMin,
      recipient,
      99n,
      feeRecipient,
    ],
  });

  return {
    value: derivedParams.value,
    bytes: encodeFunctionData({
      abi,
      functionName: "multicall",
      args: [[exactInputBytes, sweepTokenBytes]],
    }),
  };
}

export function useV2Swap({
  token0,
  token1,
  amountIn,
  stable,
  anticipatedAmountOut = 0n,
  onError,
  onSuccess,
}: V2SwapProps) {
  const chainId = useChainId();
  const { address = zeroAddress } = useAccount();
  const now = useAtomicDate(10000);
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const [multiHops] = useAtom(multiHopsAtom);
  const [slippage] = useAtom(slippageAtom);
  const amountOutMin = useMemo(
    () =>
      anticipatedAmountOut -
      (anticipatedAmountOut * BigInt(slippage)) / HUNDRED_PERCENT_BN,
    [slippage, anticipatedAmountOut]
  );
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const { value, bytes } = useMemo(
    () =>
      composeV2SwapBytes(
        token0,
        token1,
        amountIn,
        address,
        deadline,
        stable,
        chainId,
        multiHops,
        amountOutMin
      ),
    [
      token0,
      token1,
      amountIn,
      address,
      deadline,
      stable,
      chainId,
      multiHops,
      amountOutMin,
    ]
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
        value,
      }),
    [sendTransaction, bytes, router, value]
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

export function useV3Swap({
  token0,
  token1,
  amountIn,
  tickSpacing,
  sqrtPriceLimitX96,
  anticipatedAmountOut = 0n,
  onError,
  onSuccess,
}: V3SwapProps) {
  const chainId = useChainId();
  const { address = zeroAddress } = useAccount();
  const now = useAtomicDate(10000);
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const [multiHops] = useAtom(multiHopsAtom);
  const [slippage] = useAtom(slippageAtom);
  const amountOutMin = useMemo(
    () =>
      anticipatedAmountOut -
      (anticipatedAmountOut * BigInt(slippage)) / HUNDRED_PERCENT_BN,
    [slippage, anticipatedAmountOut]
  );
  const router = useMemo(() => CL_SWAP_ROUTER[chainId], [chainId]);
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const { value, bytes } = useMemo(
    () =>
      composeV3SwapBytes(
        token0,
        token1,
        tickSpacing,
        amountIn,
        address,
        sqrtPriceLimitX96,
        deadline,
        chainId,
        multiHops,
        amountOutMin
      ),
    [
      token0,
      token1,
      amountIn,
      address,
      deadline,
      sqrtPriceLimitX96,
      tickSpacing,
      chainId,
      multiHops,
      amountOutMin,
    ]
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
        value,
      }),
    [sendTransaction, bytes, router, value]
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
