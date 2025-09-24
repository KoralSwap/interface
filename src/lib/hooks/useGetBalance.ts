import { ETHER } from "@/data/constants";
import { useMemo } from "react";
import { Address, erc20Abi, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

export function useGetBalance(
  token: Address = ETHER,
  refetchInterval: number | false = false
) {
  const { address } = useAccount();
  const {
    data: etherData = { value: BigInt(0) },
    refetch: refreshEtherBalance,
  } = useBalance({
    address,
    query: {
      enabled: token.toLowerCase() === ETHER.toLowerCase(),
      refetchInterval,
    },
  });
  const { data: erc20Balance = BigInt(0), refetch: refreshTokenBalance } =
    useReadContract({
      address: token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address ?? zeroAddress],
      query: {
        enabled:
          token.toLowerCase() !== ETHER.toLowerCase() && token !== zeroAddress,
        refetchInterval,
      },
    });

  // No need to return bothe balances separately. Just return based on token address
  return useMemo(
    () =>
      token.toLowerCase() === ETHER.toLowerCase()
        ? { balance: etherData.value, refresh: refreshEtherBalance }
        : { balance: erc20Balance, refresh: refreshTokenBalance },
    [
      token,
      etherData.value,
      erc20Balance,
      refreshEtherBalance,
      refreshTokenBalance,
    ]
  );
}

export function useGetBalanceOf(
  address: Address,
  token: Address = ETHER,
  refetchInterval: number | false = false
) {
  const {
    data: etherData = { value: BigInt(0) },
    refetch: refreshEtherBalance,
  } = useBalance({
    address,
    query: {
      enabled: token.toLowerCase() === ETHER.toLowerCase(),
      refetchInterval,
    },
  });
  const { data: erc20Balance = BigInt(0), refetch: refreshTokenBalance } =
    useReadContract({
      address: token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address ?? zeroAddress],
      query: {
        enabled:
          token.toLowerCase() !== ETHER.toLowerCase() && token !== zeroAddress,
        refetchInterval,
      },
    });

  // No need to return bothe balances separately. Just return based on token address
  return useMemo(
    () =>
      token.toLowerCase() === ETHER.toLowerCase()
        ? { balance: etherData.value, refresh: refreshEtherBalance }
        : { balance: erc20Balance, refresh: refreshTokenBalance },
    [
      token,
      etherData.value,
      erc20Balance,
      refreshEtherBalance,
      refreshTokenBalance,
    ]
  );
}
