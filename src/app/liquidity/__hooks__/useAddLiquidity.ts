import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { type Address, encodeFunctionData, zeroAddress } from "viem";
import { useCallback, useEffect, useMemo } from "react";
import { ETHER, V2_ROUTER, NFT_POSITION_MANAGER } from "@/data/constants";
import * as V2Router from "@/lib/abis/V2Router";
import * as V3NFTPositionManager from "@/lib/abis/V3NFTPositionManager";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { useAtom } from "jotai/react";
import { transactionDeadlineAtom } from "@/store";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { convertETHToWETHIfApplicable } from "@/utils";

interface BaseProps {
  token0: `0x${string}`;
  token1: `0x${string}`;
  amountADesired: bigint;
  amountBDesired: bigint;
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface V2Props extends BaseProps {
  stable: boolean;
}

interface V3InitProps extends BaseProps {
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  sqrtPriceX96: bigint;
}

interface V3IncreaseProps extends Omit<BaseProps, "token0" | "token1"> {
  tokenId: bigint;
  isETH?: boolean;
  nonETHIndex?: 0 | 1;
}

function composeV2Bytes(
  tokenA: Address,
  tokenB: Address,
  stable: boolean,
  amountADesired: bigint,
  amountBDesired: bigint,
  to: Address,
  deadline: bigint
) {
  const isETH =
    tokenA.toLowerCase() === ETHER.toLowerCase() ||
    tokenB.toLowerCase() === ETHER.toLowerCase();
  const nonETHAddress = isETH
    ? tokenA.toLowerCase() === ETHER.toLowerCase()
      ? tokenB
      : tokenA
    : undefined;
  const amountTokenDesired =
    tokenA.toLowerCase() === ETHER.toLowerCase()
      ? amountBDesired
      : amountADesired;
  const value =
    tokenA.toLowerCase() === ETHER.toLowerCase()
      ? amountADesired
      : amountBDesired;
  const { abi } = V2Router;
  return isETH && !!nonETHAddress
    ? {
        value,
        data: encodeFunctionData({
          abi,
          functionName: "addLiquidityETH",
          args: [
            nonETHAddress,
            stable,
            amountTokenDesired,
            0n,
            0n,
            to,
            deadline,
          ],
        }),
        isETH,
      }
    : {
        value: 0n,
        data: encodeFunctionData({
          abi,
          functionName: "addLiquidity",
          args: [
            tokenA,
            tokenB,
            stable,
            amountADesired,
            amountBDesired,
            0n,
            0n,
            to,
            deadline,
          ],
        }),
        isETH,
      };
}

function composeV3InitializationBytes(
  tokenA: Address,
  tokenB: Address,
  tickSpacing: number,
  tickLower: number,
  tickUpper: number,
  amountADesired: bigint,
  amountBDesired: bigint,
  to: Address,
  deadline: bigint,
  sqrtPriceX96: bigint
) {
  const { abi } = V3NFTPositionManager;
  const mintParams = {
    token0: tokenA,
    token1: tokenB,
    tickSpacing,
    tickLower,
    tickUpper,
    amount0Desired: amountADesired,
    amount1Desired: amountBDesired,
    amount0Min: 0n,
    amount1Min: 0n,
    recipient: to,
    deadline,
    sqrtPriceX96,
  };
  console.log(mintParams);
  return encodeFunctionData({
    abi,
    functionName: "mint",
    args: [mintParams],
  });
}

function composeV3AdditionBytes(
  tokenId: bigint,
  amount0Desired: bigint,
  amount1Desired: bigint,
  deadline: bigint
) {
  const { abi } = V3NFTPositionManager;
  const addLPParams = {
    tokenId,
    amount0Desired,
    amount1Desired,
    deadline,
    amount0Min: 0n,
    amount1Min: 0n,
  };
  return encodeFunctionData({
    abi,
    functionName: "increaseLiquidity",
    args: [addLPParams],
  });
}

export function useV2AddLiquidity({
  token0,
  token1,
  stable,
  amountADesired,
  amountBDesired,
  onSuccess,
  onError,
}: V2Props) {
  const chainId = useChainId();
  const now = useAtomicDate();
  const { address = zeroAddress } = useAccount();
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const {
    isETH,
    value,
    data: bytes,
  } = useMemo(
    () =>
      composeV2Bytes(
        token0,
        token1,
        stable,
        amountADesired,
        amountBDesired,
        address,
        deadline
      ),
    [token0, token1, stable, amountADesired, amountBDesired, address, deadline]
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
        value: isETH ? value : undefined,
      }),
    [sendTransaction, bytes, router, isETH, value]
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

export function useV3InitializeLiquidity({
  token0,
  token1,
  tickSpacing,
  tickUpper,
  tickLower,
  amountADesired,
  amountBDesired,
  sqrtPriceX96,
  onSuccess,
  onError,
}: V3InitProps) {
  const chainId = useChainId();
  const now = useAtomicDate();
  const { address = zeroAddress } = useAccount();
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const positionManager = useMemo(
    () => NFT_POSITION_MANAGER[chainId],
    [chainId]
  );
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const isETH = useMemo(
    () =>
      token0.toLowerCase() === ETHER.toLowerCase() ||
      token1.toLowerCase() === ETHER.toLowerCase(),
    [token0, token1]
  );
  const value = useMemo(
    () =>
      isETH
        ? token0.toLowerCase() === ETHER.toLowerCase()
          ? amountADesired
          : amountBDesired
        : undefined,
    [amountADesired, amountBDesired, isETH, token0]
  );
  const bytes = useMemo(
    () =>
      composeV3InitializationBytes(
        convertETHToWETHIfApplicable(token0, chainId),
        convertETHToWETHIfApplicable(token1, chainId),
        tickSpacing,
        tickLower,
        tickUpper,
        amountADesired,
        amountBDesired,
        address,
        deadline,
        sqrtPriceX96
      ),
    [
      token0,
      token1,
      tickSpacing,
      tickLower,
      tickUpper,
      amountADesired,
      amountBDesired,
      address,
      deadline,
      sqrtPriceX96,
      chainId,
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
    () => sendTransaction({ data: bytes, to: positionManager, value }),
    [sendTransaction, bytes, positionManager, value]
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
    isError: waitErrored || sendErrored,
    isPending,
    isSuccess,
    reset,
  };
}

export function useV3IncreaseLiquidity({
  tokenId,
  isETH = false,
  amountADesired,
  amountBDesired,
  nonETHIndex,
  onSuccess,
  onError,
}: V3IncreaseProps) {
  const chainId = useChainId();
  const now = useAtomicDate();
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const positionManager = useMemo(
    () => NFT_POSITION_MANAGER[chainId],
    [chainId]
  );
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const value = useMemo(
    () =>
      isETH ? (nonETHIndex === 0 ? amountBDesired : amountADesired) : undefined,
    [isETH, nonETHIndex, amountADesired, amountBDesired]
  );
  const bytes = useMemo(
    () =>
      composeV3AdditionBytes(tokenId, amountADesired, amountBDesired, deadline),
    [tokenId, amountADesired, amountBDesired, deadline]
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
    () => sendTransaction({ data: bytes, to: positionManager, value }),
    [sendTransaction, bytes, positionManager, value]
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
    isError: waitErrored || sendErrored,
    isPending,
    isSuccess,
    reset,
  };
}
