import { Contracts } from "@/lib/contracts";
import { TAddress } from "@/lib/types";
import { erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function useGetAllowances({
  tokenOne,
  tokenTwo,
}: {
  tokenOne: TAddress;
  tokenTwo: TAddress;
}) {
  const { address } = useAccount();
  const { data: tokenOneAllowance, queryKey: tokenOneQueryKey } =
    useReadContract({
      address: tokenOne,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address ?? "0x", Contracts.Router.address],
      query: { enabled: Boolean(address) },
    });

  const { data: tokenTwoAllowance, queryKey: tokenTwoQueryKey } =
    useReadContract({
      address: tokenTwo,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address ?? "0x", Contracts.Router.address],
      query: { enabled: Boolean(address) },
    });
  return {
    tokenTwoAllowance,
    tokenOneAllowance,
    tokenOneQueryKey,
    tokenTwoQueryKey,
  };
}
