import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import PoolHeader from "@/components/shared/poolHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useKoralSwapAPI from "@/lib/hooks/useKoralSwapAPI";
import { TPoolType, TToken } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { convertETHToWETHIfApplicable } from "@/utils";
import Link from "next/link";
import React, { useMemo } from "react";
import { getAddress, zeroAddress, formatUnits } from "viem";
import { useChainId } from "wagmi";

interface Props {
  poolType: TPoolType;
  token0: TToken;
  token1: TToken;
  tickSpacing?: number | string | null;
}

export default function AvailablePoolRow({
  poolType,
  token0,
  token1,
  tickSpacing,
}: Props) {
  const chainId = useChainId();
  const { useGetAllPoolsData } = useKoralSwapAPI();
  const { pools: allPools } = useGetAllPoolsData(100, 0, 60000);

  const matchingPool = useMemo(() => {
    if (!allPools || !allPools.length) return undefined;
    const t0 = convertETHToWETHIfApplicable(token0.address, chainId);
    const t1 = convertETHToWETHIfApplicable(token1.address, chainId);
    const comparison = [t0.toLowerCase(), t1.toLowerCase()];

    const poolTypeString = convertPoolTypeToString(poolType);

    // Only support V2 pools (stable and volatile) for now
    if (poolTypeString === "concentrated") return undefined;

    const mps = allPools.find(
      (pool) =>
        comparison.includes(pool.token0.toLowerCase()) &&
        comparison.includes(pool.token1.toLowerCase()) &&
        ((poolTypeString === "stable" && pool.stable) ||
          (poolTypeString === "volatile" && !pool.stable))
    );
    return mps;
  }, [allPools, chainId, poolType, token0.address, token1.address]);

  const tvl = useMemo(() => {
    if (!matchingPool) return 0;
    return Number(
      formatUnits(matchingPool.reserve0 + matchingPool.reserve1, 18)
    );
  }, [matchingPool]);

  return (
    <Card bg="1000" className="grid py-3 grid-cols-4 lg:grid-cols-6 text-sm">
      <div className="col-span-2">
        <PoolHeader
          poolAddress={
            matchingPool ? getAddress(matchingPool.pool) : zeroAddress
          }
          token0={token0}
          token1={token1}
          poolType={poolType}
        />
      </div>
      <div className=" flex-col hidden lg:flex">
        <span className="text-neutral-300">TVL</span>
        <span>
          $
          <DisplayFormattedNumber num={formatNumber(tvl)} />
        </span>
      </div>
      <div className=" flex-col hidden lg:flex">
        <span className="text-neutral-300">Gauge Rate</span>
        <span className="text-primary-400">
          <DisplayFormattedNumber
            num={formatNumber(
              Number(formatUnits(matchingPool?.gaugeRewardRate || 0n, 18))
            )}
          />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-neutral-300">Staked</span>
        <span className="text-primary-400">
          <DisplayFormattedNumber
            num={formatNumber(
              Number(formatUnits(matchingPool?.gaugeTotalStaked || 0n, 18))
            )}
          />
        </span>
      </div>
      <div className="flex justify-end items-center">
        <Link
          href={`/liquidity/add-liquidity?token0=${token0.address}&token1=${token1.address}&version=${convertPoolTypeToString(poolType)}${tickSpacing ? `&tickSpacing=${tickSpacing}` : ""}`}
        >
          <Button size="md" variant="filled">
            Deposit
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function convertPoolTypeToString(poolType: TPoolType) {
  switch (poolType) {
    case TPoolType["STABLE"]:
      return "stable";
    case TPoolType["VOLATILE"]:
      return "volatile";
    case TPoolType["CONCENTRATED"]:
      return "concentrated";
  }
}
