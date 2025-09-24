import { useMemo } from "react";
import { Address, erc20Abi } from "viem";
import { useBytecode, useChainId, useReadContracts } from "wagmi";
import { TToken } from "../types";

export default function useGetToken({
  address,
  disabled,
}: {
  address: Address | undefined;
  disabled?: boolean;
}) {
  const chainId = useChainId();
  const { data: byteCodeData } = useBytecode({ address, chainId });
  const { data: fetchedTokenData, isFetched } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        functionName: "decimals",
        address,
      },
      {
        abi: erc20Abi,
        functionName: "symbol",
        address,
      },
      {
        abi: erc20Abi,
        address,
        functionName: "name",
      },
    ],
    query: {
      enabled: byteCodeData?.length !== 0 && !disabled,
    },
  });
  const foundToken = useMemo(() => {
    if (!address) return;
    if (fetchedTokenData) {
      const [decimals, symbol, name] = fetchedTokenData;
      if (!decimals.result || !symbol.result || !name.result) return;
      const token: TToken = {
        address,
        decimals: decimals.result,
        symbol: symbol.result,
        name: name.result,
        logoURI: null,
        chainId,
      };
      return token;
    }
  }, [address, fetchedTokenData, chainId]);
  return { token: foundToken, isFetched };
}
