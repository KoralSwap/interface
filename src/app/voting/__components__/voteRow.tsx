import PoolHeader from "@/components/shared/poolHeader";
import { TableRow } from "@/components/ui/table";
import { TPoolType } from "@/lib/types";
import React, { useCallback, useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import { convertWETHToPlainETHIfApplicable, useGetTokenInfo } from "@/utils";
import { Address, formatEther } from "viem";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { Pool } from "@/gql/graphql";
import { Allocations } from "../types";
import useGaugeCalls from "@/lib/hooks/gauges/useGaugeCalls";
import { GaugeType } from "@/lib/hooks/gauges/shared";

interface Props {
  pool: Pool;
  selectedLockId?: bigint;
  allocations: Allocations;
  allocate: (poolAddress: Address, percentage: number) => void;
}
export default function VoteRow({
  pool,
  selectedLockId,
  allocations,
  allocate,
}: Props) {
  const token0 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(pool.token0!.address as Address)
  );
  const token1 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(pool.token1!.address as Address)
  );

  const isV3 = useMemo(() => pool.poolType === "CONCENTRATED", [pool.poolType]);
  const { useCheckGaugeRewardRate } = useGaugeCalls();
  const { data: rewardRate } = useCheckGaugeRewardRate({
    gaugeType: isV3 ? GaugeType.CL : GaugeType.V2,
    address: pool.gauge!.address as Address,
    refetchInterval: 30000,
  });
  const formattedRate = useMemo(() => formatEther(rewardRate), [rewardRate]);

  const handleMaxClick = useCallback(() => {
    if (!selectedLockId) return;
    allocate(pool.address.toLowerCase() as Address, 100); // Implemented to allocate percentage left if the allocation is very close to being exhausted
  }, [allocate, pool.address, selectedLockId]);

  return (
    <TableRow mobileCols={"8"} cols="10" className="z-10 gap-x-2">
      <td className="col-span-2 lg:col-span-3">
        {" "}
        <PoolHeader
          poolType={
            pool.poolType === "STABLE"
              ? TPoolType.STABLE
              : pool.poolType === "VOLATILE"
                ? TPoolType.VOLATILE
                : TPoolType.CONCENTRATED
          }
          token0={token0}
          token1={token1}
          poolAddress={pool.address as Address}
        />
      </td>
      <td>
        ~$
        <DisplayFormattedNumber num={formatNumber(pool.reserveUSD)} />
      </td>

      <td>
        <DisplayFormattedNumber num={formatNumber(formattedRate)} />%
      </td>
      <td>
        ~$
        <DisplayFormattedNumber
          num={formatNumber(
            parseFloat(pool.totalFeesUSD) + parseFloat(pool.totalBribesUSD)
          )}
        />
      </td>
      <td>
        ~$
        <DisplayFormattedNumber num={formatNumber(pool.totalEmissionsUSD)} />
      </td>
      <td>
        <DisplayFormattedNumber num={formatNumber(pool.totalVotes)} />
      </td>
      <td className="lg:col-span-2">
        <div className="flex justify-end">
          <div className="bg-neutral-950 transition-colors group-hover:bg-neutral-900 justify-between rounded-md p-2 flex gap-x-4">
            <div className="flex gap-x-1">
              <input
                placeholder="0"
                type="number"
                min={0}
                max={100}
                value={allocations[pool.address.toLowerCase() as Address] || ""}
                onChange={(e) => {
                  const value = !isNaN(e.target.valueAsNumber)
                    ? e.target.valueAsNumber
                    : allocations[pool.address.toLowerCase() as Address] || 0;

                  allocate(pool.address.toLowerCase() as Address, value);
                }}
                className="w-[40px] focus:ring-transparent transition-all  bg-transparent"
              />
              <span className="text-neutral-400">%</span>
            </div>
            <button
              onClick={handleMaxClick}
              className="text-primary-400 disabled:text-neutral-500"
            >
              Max
            </button>
          </div>
        </div>
      </td>
    </TableRow>
  );
}
