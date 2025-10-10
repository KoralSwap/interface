import { useAccount, useChainId, useReadContract } from "wagmi";
import { abi as KoralSwapAPIAbi } from "@/lib/abis/KoralSwapAPI";
import { abi as V2FactoryAbi } from "@/lib/abis/V2Factory";
import {
  KORAL_SWAP_API,
  V2_FACTORY,
  VOTER,
  V2_ROUTER,
  WETH,
  VE,
  MINTER,
} from "@/data/constants";
import { useMemo } from "react";

export interface KoralSwapPoolData {
  pool: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  token0Symbol: string;
  token1Symbol: string;
  stable: boolean;
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  gauge: `0x${string}`;
  gaugeWeight: bigint;
  gaugeRewardRate: bigint;
  gaugeTotalStaked: bigint;
}

export interface KoralSwapUserPoolData {
  pool: `0x${string}`;
  liquidity: bigint;
  token0Amount: bigint;
  token1Amount: bigint;
  stakedInGauge: bigint;
  gaugeEarned: bigint;
  claimable0: bigint;
  claimable1: bigint;
}

export interface KoralSwapProtocolInfo {
  voter: `0x${string}`;
  ve: `0x${string}`;
  minter: `0x${string}`;
  factoryRegistry: `0x${string}`;
  koral: `0x${string}`;
  totalVotingPower: bigint;
  totalWeight: bigint;
  koralCirculating: bigint;
  weeklyEmission: bigint;
  tvl: bigint;
  totalFees: bigint;
}

export function useGetAllPoolsLength(refetchInterval: number | false = false) {
  const chainId = useChainId();

  const { data, refetch, isFetching, error } = useReadContract({
    address: V2_FACTORY[chainId],
    abi: V2FactoryAbi,
    functionName: "allPoolsLength",
    query: {
      refetchInterval,
    },
  });

  return {
    totalPools: data as bigint | undefined,
    refetch,
    isFetching,
    error,
  };
}

export function useGetAllPoolsData(
  limit: number = 10,
  offset: number = 0,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();

  const { data, refetch, isFetching, error } = useReadContract({
    address: KORAL_SWAP_API[chainId],
    abi: KoralSwapAPIAbi,
    functionName: "getAllPoolsData",
    args: [V2_FACTORY[chainId], VOTER[chainId], BigInt(offset), BigInt(limit)],
    query: {
      refetchInterval,
    },
  });

  const pools = useMemo(() => {
    if (!data) return [];
    return data as KoralSwapPoolData[];
  }, [data]);

  return {
    pools,
    refetch,
    isFetching,
    error,
  };
}

export function useGetPoolData(
  poolAddress: `0x${string}`,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();

  const { data, refetch, isFetching, error } = useReadContract({
    address: KORAL_SWAP_API[chainId],
    abi: KoralSwapAPIAbi,
    functionName: "getPoolData",
    args: [poolAddress, VOTER[chainId]],
    query: {
      refetchInterval,
      enabled: !!poolAddress,
    },
  });

  return {
    poolData: data as KoralSwapPoolData | undefined,
    refetch,
    isFetching,
    error,
  };
}

export function useGetUserPoolData(
  poolAddress: `0x${string}`,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();

  const { data, refetch, isFetching, error } = useReadContract({
    address: KORAL_SWAP_API[chainId],
    abi: KoralSwapAPIAbi,
    functionName: "getUserPoolData",
    args: [poolAddress, VOTER[chainId], accountAddress || "0x0"],
    query: {
      refetchInterval,
      enabled: !!poolAddress && !!accountAddress,
    },
  });

  return {
    userPoolData: data as KoralSwapUserPoolData | undefined,
    refetch,
    isFetching,
    error,
  };
}

export function useGetPoolTVL(
  poolAddress: `0x${string}`,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();

  const { data, refetch, isFetching, error } = useReadContract({
    address: KORAL_SWAP_API[chainId],
    abi: KoralSwapAPIAbi,
    functionName: "getPoolTVL",
    args: [
      poolAddress,
      V2_ROUTER[chainId],
      WETH[chainId], // target token (WETH/KON)
      WETH[chainId], // weth
    ],
    query: {
      refetchInterval,
      enabled: !!poolAddress,
    },
  });

  return {
    poolTVL: data as bigint | undefined,
    refetch,
    isFetching,
    error,
  };
}

export function useGetUserPositions(
  poolAddresses: `0x${string}`[],
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();

  const { data, refetch, isFetching, error } = useReadContract({
    address: KORAL_SWAP_API[chainId],
    abi: KoralSwapAPIAbi,
    functionName: "getUserPositions",
    args: [poolAddresses, VOTER[chainId], accountAddress || "0x0"],
    query: {
      refetchInterval,
      enabled: !!accountAddress && poolAddresses.length > 0,
    },
  });

  const positions = useMemo(() => {
    if (!data) return [];
    const userPositions = data as KoralSwapUserPoolData[];
    // Filter out positions with no liquidity
    return userPositions.filter(
      (pos) => pos.liquidity > 0n || pos.stakedInGauge > 0n
    );
  }, [data]);

  return {
    positions,
    refetch,
    isFetching,
    error,
  };
}

export function useGetProtocolInfo(refetchInterval: number | false = false) {
  const chainId = useChainId();

  const { data, refetch, isFetching, error } = useReadContract({
    address: KORAL_SWAP_API[chainId],
    abi: KoralSwapAPIAbi,
    functionName: "getProtocolInfo",
    args: [
      VOTER[chainId],
      VE[chainId],
      MINTER[chainId],
      V2_FACTORY[chainId],
      V2_ROUTER[chainId],
      WETH[chainId], // target token for pricing
      WETH[chainId], // weth
    ],
    query: {
      refetchInterval,
    },
  });

  return {
    protocolInfo: data as KoralSwapProtocolInfo | undefined,
    refetch,
    isFetching,
    error,
  };
}

export default function useKoralSwapAPI() {
  return {
    useGetAllPoolsLength,
    useGetAllPoolsData,
    useGetPoolData,
    useGetUserPoolData,
    useGetPoolTVL,
    useGetUserPositions,
    useGetProtocolInfo,
  };
}
