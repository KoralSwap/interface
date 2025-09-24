import { VOTER } from "@/data/constants";
import { useMemo } from "react";
import { Address, zeroAddress } from "viem";
import { useChainId, useReadContract } from "wagmi";
import * as Voter from "@/lib/abis/Voter";

export function useGetWeights({ pair = zeroAddress }: { pair?: Address }) {
  const chainId = useChainId();
  const voter = useMemo(() => VOTER[chainId], [chainId]);
  const { data = BigInt(0) } = useReadContract({
    ...Voter,
    address: voter,
    functionName: "weights",
    args: [pair],
    query: {
      enabled: pair !== zeroAddress,
      refetchInterval: 30000, // Refetch in 30 seconds
    },
  });
  return data;
}
