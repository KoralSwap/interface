import { ETHER } from "@/data/constants";
import { Address, erc20Abi, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";

/**
 * Returns write data request only if the allowance is less than the amount
 * returns
 *
 * @approveWriteRequest: undefined,
 * @needsApproval: false,
 * @allowanceKey: queryKey,
 * @isFetching,
 */
export default function useCheckAllowance(
  token: Address = zeroAddress,
  spender: Address = zeroAddress,
  expectedAmount: bigint = 0n,
  refetchInterval: number | false = false
) {
  const { address = zeroAddress } = useAccount();
  const {
    data = 0n,
    refetch,
    isLoading,
    isFetching,
  } = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: "allowance",
    args: [address, spender],
    query: {
      enabled:
        address !== zeroAddress &&
        token !== zeroAddress &&
        spender !== zeroAddress &&
        expectedAmount > 0n &&
        token.toLowerCase() !== ETHER.toLowerCase(),
      refetchInterval,
    },
  });

  return {
    refresh: refetch,
    isLoading: isLoading || isFetching,
    isAllowed:
      data >= expectedAmount || token.toLowerCase() === ETHER.toLowerCase(),
  };
}
