import { VE } from "@/data/constants";
import * as Ve from "@/lib/abis/Ve";
import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";

function useGetNFTBalance({
  tokenId,
  refetchInterval = false,
}: {
  tokenId: bigint;
  refetchInterval?: number | false;
}) {
  const { abi } = Ve;
  const chainId = useChainId();
  const escrow = useMemo(() => VE[chainId], [chainId]);
  const { data = 0n } = useReadContract({
    abi,
    address: escrow,
    functionName: "balanceOfNFT",
    args: [tokenId],
    query: { enabled: tokenId !== 0n, refetchInterval },
  });
  return data;
}

export default function useEscrowCalls() {
  return { useGetNFTBalance };
}
