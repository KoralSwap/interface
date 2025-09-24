import * as V3Pool from "@/lib/abis/CLPool";
import * as CLFactory from "@/lib/abis/CLFactory";
import * as V2Factory from "@/lib/abis/V2Factory";
import {
  Address,
  decodeFunctionResult,
  encodeFunctionData,
  zeroAddress,
} from "viem";
import { useCall, useChainId, useReadContract } from "wagmi";
import { useMemo } from "react";
import { CL_FACTORY, V2_FACTORY } from "@/data/constants";

export function useV3CheckPoolSlot0({
  pool,
  refetchInterval = false,
}: {
  pool: Address;
  refetchInterval?: number | false;
}) {
  const { abi } = V3Pool;
  const { data = [0n, 0, 0, 0, 0, false], refetch } = useReadContract({
    abi,
    address: pool,
    functionName: "slot0",
    query: { enabled: pool !== zeroAddress, refetchInterval },
  });

  return { data, refetch };
}

function getFeeBytes(isV3: boolean, pool: Address, stable: boolean = true) {
  if (isV3) {
    const { abi } = CLFactory;
    return encodeFunctionData({
      abi,
      functionName: "getSwapFee",
      args: [pool],
    });
  }

  const { abi } = V2Factory;
  return encodeFunctionData({
    abi,
    functionName: "getFee",
    args: [pool, stable],
  });
}

export function useCheckPoolFees({
  isV3,
  stable,
  pool,
}: {
  isV3: boolean;
  stable?: boolean;
  pool: Address;
}) {
  const chainId = useChainId();
  const factory = useMemo(
    () => (isV3 ? CL_FACTORY[chainId] : V2_FACTORY[chainId]),
    [chainId, isV3]
  );
  const { data } = useCall({
    to: factory,
    data: getFeeBytes(isV3, pool, stable),
    query: { enabled: pool !== zeroAddress },
  });
  const fee = useMemo(() => {
    if (data?.data) {
      if (isV3) {
        const { abi } = CLFactory;
        const decodedResult = decodeFunctionResult({
          abi,
          data: data.data,
          functionName: "getSwapFee",
        });
        return decodedResult / 10_000;
      }

      const { abi } = V2Factory;
      const decodedResult = decodeFunctionResult({
        abi,
        data: data.data,
        functionName: "getFee",
      });
      return Number(decodedResult) / 100;
    }
    return 0;
  }, [data?.data, isV3]);
  return fee;
}
