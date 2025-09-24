import { useAccount, useReadContract, useSimulateContract } from "wagmi";
import { UniswapV2Router } from "./uniswap";
import { erc20Abi, parseUnits } from "viem";
import { TAddress } from "@/lib/types";
interface Props {
  token: TAddress;
  deposit: string;
}
const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export function useEthSwap({ token, deposit }: Props) {
  const { address } = useAccount();
  const { data: decimals } = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: "decimals",
  });
  const { data, error } = useSimulateContract({
    address: UniswapV2Router.address,
    abi: UniswapV2Router.abi,
    functionName: "swapETHForExactTokens",
    args: [
      parseUnits(deposit, decimals ?? 18),
      [WETH_ADDRESS, token],
      address ?? "0x",
      BigInt(Math.floor(Date.now() / 1000) + 60 * 10000000),
    ],
    value: parseUnits("1", 18),
  });
  console.log(data, error);
  return { data, error };
}
