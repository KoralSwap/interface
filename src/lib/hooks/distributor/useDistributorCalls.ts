import { DISTRIBUTOR } from "@/data/constants";
import * as RD from "@/lib/abis/RewardsDistributor";
import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";

function useClaimable(
  tokenId: bigint,
  refetchInterval: number | false = false
) {
  const { abi } = RD;
  const chainId = useChainId();
  const dist = useMemo(() => DISTRIBUTOR[chainId], [chainId]);
  const { data = 0n } = useReadContract({
    abi,
    address: dist,
    functionName: "claimable",
    args: [tokenId],
    query: { enabled: tokenId !== 0n, refetchInterval },
  });

  return data;
}

export default function useDistributorCalls() {
  return { useClaimable };
}
