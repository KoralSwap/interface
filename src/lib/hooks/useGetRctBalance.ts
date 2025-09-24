import { Contracts } from "@/lib/contracts";
import { useAccount, useReadContract } from "wagmi";

export default function useGetRctBalance() {
  const { address } = useAccount();
  const { data, queryKey } = useReadContract({
    ...Contracts.Reactor,
    functionName: "balanceOf",
    args: [address ?? "0x"],
    query: {
      enabled: Boolean(address),
    },
  });
  return { rctBalance: data, rctQueryKey: queryKey };
}
