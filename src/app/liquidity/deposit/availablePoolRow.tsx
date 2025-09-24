import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import PoolHeader from "@/components/shared/poolHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import { TPoolType, TToken } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { convertETHToWETHIfApplicable } from "@/utils";
import Link from "next/link";
import React, { useMemo } from "react";
import { getAddress, zeroAddress } from "viem";
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
  // const { pairAddress: v2PairAddress } = useV2CheckPair(
  //   convertETHToWETHIfApplicable(token0.address, chainId),
  //   convertETHToWETHIfApplicable(token1.address, chainId),
  //   poolType === TPoolType.STABLE
  // );
  // const { data: QLSPV2 } = useQLGetSinglePool(v2PairAddress, 15000);

  const { useQLGetAllPools } = usePoolQueries();
  const { data: QLAP } = useQLGetAllPools();
  const matchingPool = useMemo(() => {
    if (!QLAP || !QLAP.Pool.length) return undefined;
    const t0 = convertETHToWETHIfApplicable(token0.address, chainId);
    const t1 = convertETHToWETHIfApplicable(token1.address, chainId);
    const comparison = [t0.toLowerCase(), t1.toLowerCase()];
    const mps = QLAP.Pool.find(
      (pool) =>
        comparison.includes(pool.token0!.address.toLowerCase()) &&
        comparison.includes(pool.token1!.address.toLowerCase()) &&
        pool.poolType.toLowerCase() === convertPoolTypeToString(poolType) &&
        pool.tickSpacing === tickSpacing
    );
    return mps;
  }, [QLAP, chainId, poolType, tickSpacing, token0.address, token1.address]);

  return (
    <Card bg="1000" className="grid py-3 grid-cols-4 lg:grid-cols-6 text-sm">
      <div className="col-span-2">
        <PoolHeader
          poolAddress={
            matchingPool ? getAddress(matchingPool.address) : zeroAddress
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
          <DisplayFormattedNumber
            num={formatNumber(matchingPool?.reserveUSD || 0)}
          />
        </span>
      </div>
      <div className=" flex-col hidden lg:flex">
        <span className="text-neutral-300">APR</span>
        <span className="text-primary-400">
          <DisplayFormattedNumber
            num={formatNumber(matchingPool?.gauge?.rewardRate || 0)}
          />
          %
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-neutral-300">Volume</span>
        <span className="text-primary-400">
          $
          <DisplayFormattedNumber
            num={formatNumber(matchingPool?.volumeUSD || 0)}
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
