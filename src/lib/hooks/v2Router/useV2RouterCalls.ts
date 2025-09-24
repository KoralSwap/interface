import { V2_FACTORY, V2_ROUTER } from "@/data/constants";
import * as V2Router from "@/lib/abis/V2Router";
import { useMemo } from "react";
import { Address } from "viem";
import { useChainId, useReadContract } from "wagmi";

function useV2RouterQuoteRemoveLiquidity(
  token0: Address,
  token1: Address,
  stable: boolean,
  liquidity: bigint = 0n
) {
  const { abi } = V2Router;
  const chainId = useChainId();
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  const factory = useMemo(() => V2_FACTORY[chainId], [chainId]);
  const { data: [amount0, amount1] = [0n, 0n], refetch } = useReadContract({
    abi,
    address: router,
    functionName: "quoteRemoveLiquidity",
    args: [token0, token1, stable, factory, liquidity],
    query: { enabled: liquidity > 0n },
  });
  return { amount0, amount1, refetch };
}

export default function useV2RouterCalls() {
  return { useV2RouterQuoteRemoveLiquidity };
}
