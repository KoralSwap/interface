import { Address, zeroAddress } from "viem";
import * as V2Router from "@/lib/abis/V2Router";
import * as V3NFTPositionManager from "@/lib/abis/V3NFTPositionManager";
import { useChainId, useReadContract, useSimulateContract } from "wagmi";
import { useMemo } from "react";
import { NFT_POSITION_MANAGER, V2_FACTORY, V2_ROUTER } from "@/data/constants";

interface BaseProps {
  liquidity: bigint;
  refetchInterval?: number | false;
}

interface V2QuoteRemoveLiquidityProps extends BaseProps {
  token0: Address;
  token1: Address;
  stable: boolean;
  liquidity: bigint;
}

interface V3QuoteRemoveLiquidityProps extends BaseProps {
  tokenId?: bigint;
}

export function useV2QuoteRemoveLiquidity({
  token0,
  token1,
  stable,
  liquidity,
  refetchInterval = false,
}: V2QuoteRemoveLiquidityProps) {
  const chainId = useChainId();
  const { abi } = V2Router;
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const factory = useMemo(() => V2_FACTORY[chainId], [chainId]);
  const { data = [0n, 0n] } = useReadContract({
    abi,
    address: router,
    functionName: "quoteRemoveLiquidity",
    args: [token0, token1, stable, factory, liquidity],
    query: {
      enabled:
        liquidity > 0n && token0 !== zeroAddress && token1 !== zeroAddress,
      refetchInterval,
    },
  });
  return { amount0Received: data[0], amount1Received: data[1] };
}

export function useV3QuoteRemoveLiquidity({
  tokenId = 0n,
  liquidity,
  refetchInterval,
}: V3QuoteRemoveLiquidityProps) {
  const chainId = useChainId();
  const { abi } = V3NFTPositionManager;
  const positionManager = useMemo(
    () => NFT_POSITION_MANAGER[chainId],
    [chainId]
  );
  const { data } = useSimulateContract({
    abi,
    functionName: "decreaseLiquidity",
    address: positionManager,
    args: [
      { tokenId, liquidity, amount0Min: 0n, amount1Min: 0n, deadline: 1200n },
    ],
    query: { enabled: tokenId > 0n && liquidity > 0n, refetchInterval },
  });
  return {
    amount0Received: data ? data.result[0] : 0n,
    amount1Received: data ? data.result[1] : 0n,
  };
}
