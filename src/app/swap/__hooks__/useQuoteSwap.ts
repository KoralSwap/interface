import { useChainId, useReadContract, useSimulateContract } from "wagmi";
import { Address, encodeFunctionData, hexToBigInt, zeroAddress } from "viem";
import { useEffect, useMemo, useState } from "react";
import { CL_SWAP_ROUTER, V2_ROUTER } from "@/data/constants";
import { useAtom } from "jotai";
import { multiHopsAtom, transactionDeadlineAtom } from "@/store";
import { deriveV2SwapRoutes, deriveV3SwapParams } from "./shared";
import * as V2Router from "@/lib/abis/V2Router";
import * as V3Router from "@/lib/abis/V3Router";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";

interface BaseProps {
  amountIn: bigint;
  refetchInterval?: number | false;
}

interface V2QuoteSwapProps extends BaseProps {
  token0: Address;
  token1: Address;
}

interface V3QuoteSwapProps extends BaseProps {
  token0: Address;
  token1: Address;
  tickSpacing: number;
  sqrtPriceLimitX96: bigint;
}

export function useV2QuoteSwap({
  token0,
  token1,
  amountIn,
  refetchInterval = false,
}: V2QuoteSwapProps) {
  const { abi } = V2Router;
  const chainId = useChainId();
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const [isMultihopped] = useAtom(multiHopsAtom);
  const routesStable = deriveV2SwapRoutes(
    token0,
    token1,
    true,
    chainId,
    isMultihopped
  );
  const routesVolatile = deriveV2SwapRoutes(
    token0,
    token1,
    false,
    chainId,
    isMultihopped
  );
  const { data: amountsOutStable = [] } = useReadContract({
    abi,
    address: router,
    functionName: "getAmountsOut",
    args: [amountIn, routesStable as []],
    query: {
      enabled: token0 !== zeroAddress && token1 !== zeroAddress,
      refetchInterval,
    },
  });
  const { data: amountsOutVolatile = [] } = useReadContract({
    abi,
    address: router,
    functionName: "getAmountsOut",
    args: [amountIn, routesVolatile as []],
    query: {
      enabled: token0 !== zeroAddress && token1 !== zeroAddress,
      refetchInterval,
    },
  });

  const amountOutVolatile = useMemo(
    () => amountsOutVolatile[amountsOutVolatile.length - 1] || 0n,
    [amountsOutVolatile]
  );
  const amountOutStable = useMemo(
    () => amountsOutStable[amountsOutStable.length - 1] || 0n,
    [amountsOutStable]
  );

  return {
    isStable: amountOutStable >= amountOutVolatile,
    amountOut:
      amountOutStable >= amountOutVolatile
        ? amountOutStable
        : amountOutVolatile,
    routesAvailable: amountOutVolatile > 0n || amountOutStable > 0n,
  };
}

export function useV3QuoteSwap({
  token0,
  token1,
  amountIn,
  refetchInterval,
  tickSpacing,
  sqrtPriceLimitX96,
}: V3QuoteSwapProps) {
  const chainId = useChainId();
  const { abi } = V3Router;
  const [isMultihopped] = useAtom(multiHopsAtom);
  const now = useAtomicDate(30000);
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const router = useMemo(() => CL_SWAP_ROUTER[chainId], [chainId]);
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const [amountOut, setAmountOut] = useState(0n);
  const derivedParams = useMemo(
    () =>
      deriveV3SwapParams(
        token0,
        token1,
        router,
        tickSpacing,
        sqrtPriceLimitX96,
        amountIn,
        chainId,
        deadline,
        0n,
        isMultihopped
      ),
    [
      amountIn,
      chainId,
      deadline,
      isMultihopped,
      router,
      sqrtPriceLimitX96,
      tickSpacing,
      token0,
      token1,
    ]
  );
  const exactInputBytes = useMemo(
    () =>
      derivedParams.isMultipath
        ? encodeFunctionData({
            abi,
            functionName: "exactInput",
            args: [derivedParams.params],
          })
        : encodeFunctionData({
            abi,
            functionName: "exactInputSingle",
            args: [derivedParams.params],
          }),
    [abi, derivedParams.isMultipath, derivedParams.params]
  );

  const multicallSimulation = useSimulateContract({
    abi,
    address: router,
    functionName: "multicall",
    args: [[exactInputBytes]],
    value: derivedParams.value,
    query: {
      enabled: token0 !== zeroAddress && token1 !== zeroAddress,
      refetchInterval,
    },
  });

  useEffect(() => {
    if (amountIn <= 0n) {
      setAmountOut(0n);
      return;
    }
    if (multicallSimulation.data && multicallSimulation.data.result) {
      const [amountOutByte] = multicallSimulation.data.result;
      setAmountOut(hexToBigInt(amountOutByte));
    } else {
      setAmountOut(0n);
    }
  }, [amountIn, multicallSimulation.data, multicallSimulation.error]);

  return { amountOut, routesAvailable: amountOut > 0n };
}
