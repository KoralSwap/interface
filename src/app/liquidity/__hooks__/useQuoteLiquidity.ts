import { useMemo } from "react";
import { Address, zeroAddress } from "viem";
import * as V2Router from "@/lib/abis/V2Router";
import * as V3NFTPositionManager from "@/lib/abis/V3NFTPositionManager";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { useAtom } from "jotai/react";
import { transactionDeadlineAtom } from "@/store";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSimulateContract,
} from "wagmi";
import {
  ETHER,
  NFT_POSITION_MANAGER,
  V2_FACTORY,
  V2_ROUTER,
} from "@/data/constants";
import { convertETHToWETHIfApplicable } from "@/utils";

export function useV2QuoteAddLiquidity(
  token0: Address,
  token1: Address,
  stable: boolean,
  amount0Desired: bigint,
  amount1Desired: bigint,
  refetchInterval: number | false = false
) {
  const { abi } = V2Router;
  const chainId = useChainId();
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const factory = useMemo(() => V2_FACTORY[chainId], [chainId]);
  const {
    data = [0n, 0n, 0n],
    isLoading,
    isFetching,
    isPending,
  } = useReadContract({
    abi,
    address: router,
    functionName: "quoteAddLiquidity",
    args: [token0, token1, stable, factory, amount0Desired, amount1Desired],
    query: { enabled: !stable, refetchInterval },
  });

  return {
    amount0Needed: data[0],
    amount1Needed: data[1],
    projectedLiquidity: data[2],
    isLoading: isLoading || isFetching || isPending,
  };
}

export function useV3QuoteAddLiquidity(
  token0: Address,
  token1: Address,
  tickSpacing: number,
  tickLower: number,
  tickUpper: number,
  sqrtPriceX96: bigint,
  amount0Desired: bigint,
  amount1Desired: bigint,
  tokenId: bigint = 0n,
  refetchInterval: number | false = false
) {
  const { abi } = V3NFTPositionManager;
  const now = useAtomicDate(30000);
  const chainId = useChainId();
  const positionManager = useMemo(
    () => NFT_POSITION_MANAGER[chainId],
    [chainId]
  );
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const { address = zeroAddress } = useAccount();
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
          ? amount0Desired
          : amount1Desired
        : undefined,
    [amount0Desired, amount1Desired, isETH, token0]
  );

  const {
    data: mintData,
    isLoading: mintLoading,
    isFetching: mintFetching,
    isPending: mintPending,
  } = useSimulateContract({
    abi,
    address: positionManager,
    functionName: "mint",
    args: [
      {
        token0: convertETHToWETHIfApplicable(token0, chainId),
        token1: convertETHToWETHIfApplicable(token1, chainId),
        tickSpacing,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        sqrtPriceX96,
        amount0Min: 0n,
        amount1Min: 0n,
        recipient: address,
        deadline,
      },
    ],
    query: {
      enabled:
        (!tokenId || tokenId === 0n) &&
        token0 !== zeroAddress &&
        token1 !== zeroAddress,
      refetchInterval,
    },
    value,
  });

  const {
    data: increaseLiquidityData,
    isLoading: increaseLoading,
    isFetching: increaseFetching,
    isPending: increasePending,
  } = useSimulateContract({
    abi,
    address: positionManager,
    functionName: "increaseLiquidity",
    args: [
      {
        tokenId,
        amount0Desired,
        amount1Desired,
        amount0Min: 0n,
        amount1Min: 0n,
        deadline,
      },
    ],
    query: { enabled: !!tokenId || tokenId > 0n, refetchInterval },
    value,
  });

  // useEffect(() => {
  //   console.log(error0, error1);
  // }, [error0, error1]);

  return tokenId === 0n
    ? {
        amount0: mintData?.result[2] ?? 0n,
        amount1: mintData?.result[3] ?? 0n,
        liquidity: mintData?.result[1] ?? 0n,
        isLoading: mintLoading || mintFetching || mintPending,
      }
    : {
        amount0: increaseLiquidityData?.result[1] ?? 0n,
        amount1: increaseLiquidityData?.result[2] ?? 0n,
        liquidity: increaseLiquidityData?.result[0] ?? 0n,
        isLoading: increaseLoading || increaseFetching || increasePending,
      };
}
