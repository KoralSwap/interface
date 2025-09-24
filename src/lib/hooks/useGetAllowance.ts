import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function useGetAllowance({
  tokenAddress,
  spender,
  disabled,
}: {
  tokenAddress: Address | undefined;
  spender: Address;
  disabled?: boolean;
}) {
  const { address } = useAccount();
  return useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address ?? "0x", spender],
    query: { enabled: !disabled && Boolean(address), staleTime: 1000 * 60 * 5 },
  });
}
