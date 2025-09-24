import { useMemo } from "react";
import { useNetwork } from "../hooks";
import { eqIgnoreCase, isNativeAddress } from "../utils";

export function useWrapOrUnwrapOnly(
  fromTokenAddress?: string,
  toTokenAddress?: string
) {
  const network = useNetwork()?.wToken.address;
  // Evaluates whether tokens are to be wrapped/unwrapped only
  return useMemo(() => {
    return {
      isWrapOnly:
        eqIgnoreCase(network || "", toTokenAddress || "") &&
        isNativeAddress(fromTokenAddress || ""),
      isUnwrapOnly:
        eqIgnoreCase(network || "", fromTokenAddress || "") &&
        isNativeAddress(toTokenAddress || ""),
    };
  }, [fromTokenAddress, toTokenAddress, network]);
}
