import React from "react";
import CurrenciesOverlapIcons from "./currenciesOverlapIcons";
import { Badge } from "../ui/badge";
import { TPoolType, TToken } from "@/lib/types";
import { Address, zeroAddress } from "viem";
import { useCheckPoolFees } from "@/lib/hooks/pools/usePoolCalls";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";

interface Props {
  poolType: TPoolType;
  token0: TToken | undefined;
  token1: TToken | undefined;
  number?: string;
  poolAddress?: Address;
}

export default function PoolHeader({
  poolType,
  token0,
  token1,
  number,
  poolAddress = zeroAddress,
}: Props) {
  const { width: windowWidth = 0 } = useWindowDimensions();
  const fee = useCheckPoolFees({
    isV3: poolType === TPoolType.CONCENTRATED,
    stable: poolType === TPoolType.STABLE,
    pool: poolAddress,
  });
  return (
    token0 &&
    token1 && (
      <div className="flex gap-x-4 items-center">
        {number && <span>{number}</span>}
        <div className="flex gap-x-2 items-center">
          <CurrenciesOverlapIcons
            token0={token0}
            token1={token1}
            size={windowWidth < 601 ? "sm" : "md"}
          />
          <div>
            <h4 className="text-left text-xs md:text-sm">
              {`${poolType === TPoolType.STABLE ? "sAMM" : poolType === TPoolType.VOLATILE ? "vAMM" : "clAMM"}`}
              -{token0.symbol}/{token1.symbol}
            </h4>
            <div className="space-x-1 flex justify-start">
              <PoolBadge poolType={poolType} />
              <Badge colors="neutral" border="one">
                {fee}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
function PoolBadge({ poolType }: { poolType: TPoolType }) {
  if (poolType === TPoolType.STABLE) {
    return <Badge colors="success">Stable</Badge>;
  }
  if (poolType === TPoolType.CONCENTRATED) {
    return <Badge colors="primary">Concentrated</Badge>;
  }
  if (poolType === TPoolType.VOLATILE) {
    return <Badge colors="yellow">Volatile</Badge>;
  }
}
