import { CL_FACTORY, V2_FACTORY } from "@/data/constants";
import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";
import * as V2Factory from "../abis/V2Factory";
import * as CLFactory from "../abis/CLFactory";
import { zeroAddress } from "viem";
import { convertETHToWETHIfApplicable } from "@/utils";

export function useV2CheckPair(
  token0: `0x${string}`,
  token1: `0x${string}`,
  stable: boolean,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const { abi } = V2Factory;
  const factory = useMemo(() => V2_FACTORY[chainId], [chainId]);
  const {
    data = zeroAddress,
    isLoading,
    error,
  } = useReadContract({
    abi,
    address: factory,
    functionName: "getPool",
    args: [
      convertETHToWETHIfApplicable(token0),
      convertETHToWETHIfApplicable(token1),
      stable,
    ],
    query: {
      enabled: token0 !== zeroAddress && token1 !== zeroAddress,
      refetchInterval,
    },
  });

  return { exists: data !== zeroAddress, isLoading, error, pairAddress: data };
}

export function useV3CheckPair(
  token0: `0x${string}`,
  token1: `0x${string}`,
  tickSpacing: number,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const { abi } = CLFactory;
  const factory = useMemo(() => CL_FACTORY[chainId], [chainId]);
  const {
    data = zeroAddress,
    isLoading,
    error,
  } = useReadContract({
    abi,
    address: factory,
    functionName: "getPool",
    args: [
      convertETHToWETHIfApplicable(token0),
      convertETHToWETHIfApplicable(token1),
      tickSpacing,
    ],
    query: {
      enabled: token0 !== zeroAddress && token1 !== zeroAddress,
      refetchInterval,
    },
  });

  return { exists: data !== zeroAddress, isLoading, error, pairAddress: data };
}
