import { TToken } from "@/lib/types";

import { parseUnits } from "viem";

interface Props {
  amount0: string;
  amount1: string;
  balance0: bigint;
  balance1: bigint;
  token0: TToken | undefined;
  token1: TToken | undefined;
  needsWrap: boolean;
}
export default function useInitializePoolValidation({
  amount0,
  amount1,
  balance0,
  balance1,
  token0,
  token1,
  needsWrap,
}: Props) {
  if (isNaN(Number(amount0)) || isNaN(Number(amount1)))
    return {
      isValid: false,
      errorMessage: "Invalid amount entered",
    };
  if (parseUnits(amount0, token0?.decimals ?? 0) > balance0 && !needsWrap) {
    return {
      isValid: false,
      errorMessage: `Insufficient ${token0?.symbol} Balance.`,
    };
  }
  if (parseUnits(amount1, token1?.decimals ?? 0) > balance1 && !needsWrap) {
    return {
      isValid: false,
      errorMessage: `Insufficient ${token1?.symbol} Balance.`,
    };
  }
  return { isValid: true, errorMessage: null };
}
