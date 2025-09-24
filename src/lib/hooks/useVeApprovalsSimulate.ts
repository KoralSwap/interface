import { Address, zeroAddress } from "viem";
import * as Ve from "../abis/Ve";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSimulateContract,
} from "wagmi";
import { useMemo } from "react";
import { VE } from "@/data/constants";

export function useVeApprovalForSingle({
  tokenId,
  spender,
}: {
  tokenId: bigint;
  spender: Address;
}) {
  const chainId = useChainId();
  const ve = useMemo(() => VE[chainId], [chainId]);
  const {
    data: isApprovedOrOwner = false,
    queryKey: isApprovedOrOwnerQueryKey,
  } = useReadContract({
    ...Ve,
    address: ve,
    functionName: "isApprovedOrOwner",
    args: [spender, tokenId],
    query: {
      enabled: tokenId !== 0n && spender !== zeroAddress,
      refetchInterval: 60000, // Refetch every minute
    },
  });
  const {
    data: simulation,
    isLoading,
    isFetching,
    isPending,
  } = useSimulateContract({
    ...Ve,
    address: ve,
    functionName: "approve",
    args: [spender, tokenId],
    query: {
      enabled: tokenId !== 0n && spender !== zeroAddress,
    },
  });

  return {
    simulation:
      !isApprovedOrOwner && simulation?.request ? simulation : undefined,
    isLoading: isLoading || isFetching || isPending,
    needsApproval: !isApprovedOrOwner,
    queryKey: isApprovedOrOwnerQueryKey,
  };
}

export function useVeApprovalForMany({ spender }: { spender: Address }) {
  const chainId = useChainId();
  const ve = useMemo(() => VE[chainId], [chainId]);
  const { address = zeroAddress } = useAccount();
  const { data: isApprovedForAll = false, queryKey: isApprovedForAllQueryKey } =
    useReadContract({
      ...Ve,
      address: ve,
      functionName: "isApprovedForAll",
      args: [address, spender],
      query: {
        enabled: spender !== zeroAddress && address !== zeroAddress,
        refetchInterval: 60000, // Refetch per minute
      },
    });
  const {
    data: simulation,
    isLoading,
    isFetching,
    isPending,
  } = useSimulateContract({
    ...Ve,
    address: ve,
    functionName: "setApprovalForAll",
    args: [spender, true],
    query: {
      enabled: spender !== zeroAddress,
    },
  });

  return {
    simulation:
      !isApprovedForAll && simulation?.request ? simulation : undefined,
    isLoading: isLoading || isFetching || isPending,
    needsApproval: !isApprovedForAll,
    queryKey: isApprovedForAllQueryKey,
  };
}
