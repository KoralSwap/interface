import { useMemo } from "react";
import { toExactAmount, toRawAmount } from "./utils";
import { useChainId, useReadContracts } from "wagmi";
import { Address, erc20Abi } from "viem";
import { getNetwork } from "./networks";
import { Token } from "./types";

export const useToExactAmount = (amount?: string, decimals?: number) => {
  return useMemo(() => toExactAmount(amount, decimals), [amount, decimals]);
};

export const useToRawAmount = (amount?: string, decimals?: number) => {
  return useMemo(() => toRawAmount(amount, decimals), [amount, decimals]);
};

export const useNetwork = () => {
  const chainId = useChainId();

  return useMemo(() => {
    if (!chainId) return;
    return getNetwork(chainId);
  }, [chainId]);
};

export const useExplorer = () => {
  const network = useNetwork();

  return network?.explorer;
};

export const useToken = (address?: Address) => {
  const { data: token } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  return useMemo((): Token | undefined => {
    if (!token || !address) return;
    return {
      symbol: token[2],
      decimals: token[0],
      address,
      name: token[1],
      logoUrl: "",
    };
  }, [token, address]);
};
