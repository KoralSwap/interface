import { useSimulateContract } from "wagmi";
import { useLiquidityCardFormProvider } from "../liquidityCardFormProvider";
import { Contracts } from "@/lib/contracts";
import { maxUint256 } from "viem";

// altered abi for USDT edge case
const abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [],
  },
];

export default function useApproveTokens({
  approveTokenOne,
  approveTokenTwo,
}: {
  approveTokenOne: boolean;
  approveTokenTwo: boolean;
}) {
  const { tokenOne, tokenTwo } = useLiquidityCardFormProvider();
  const { data: approveTokenOneRequest, isLoading: isOneLoading } =
    useSimulateContract({
      address: tokenOne,
      abi,
      functionName: "approve",
      args: [Contracts.Router.address, maxUint256],
      query: { enabled: approveTokenOne },
    });
  const { data: approveTokenTwoRequest, isLoading: isTwoLoading } =
    useSimulateContract({
      address: tokenTwo,
      abi,
      functionName: "approve",
      args: [Contracts.Router.address, maxUint256],
      query: { enabled: approveTokenTwo },
    });
  if (approveTokenOne) {
    return { data: approveTokenOneRequest, isLoading: isOneLoading };
  }
  if (approveTokenTwo) {
    return { data: approveTokenTwoRequest, isLoading: isTwoLoading };
  }
  return { data: undefined, isLoading: false };
}
