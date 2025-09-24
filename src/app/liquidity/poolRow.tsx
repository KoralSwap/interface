import CurrenciesOverlapIcons from "@/components/shared/currenciesOverlapIcons";
import PoolHeader from "@/components/shared/poolHeader";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table";
import { TPoolType } from "@/lib/types";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTokenlistContext } from "@/contexts/tokenlistContext";
import { formatNumber } from "@/lib/utils";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { type Pool } from "@/gql/graphql";
import { convertWETHToPlainETHIfApplicable } from "@/utils";
import { useChainId } from "wagmi";
import { getAddress } from "viem";

interface RowProps {
  data: Pool;
}

export default function PoolRow({
  data: {
    token0,
    token1,
    poolType,
    volumeUSD,
    gauge,
    reserveUSD,
    totalFeesUSD,
    tickSpacing,
    address,
  },
}: RowProps) {
  const chainId = useChainId();
  const router = useRouter();
  const { tokenlist } = useTokenlistContext();
  const t0 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() ===
          convertWETHToPlainETHIfApplicable(
            token0!.address as `0x${string}`,
            chainId
          ).toLowerCase()
      ),
    [tokenlist, token0, chainId]
  );
  const t1 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() ===
          convertWETHToPlainETHIfApplicable(
            token1!.address as `0x${string}`,
            chainId
          ).toLowerCase()
      ),
    [tokenlist, token1, chainId]
  );

  const addLiquidityHandler = useCallback(() => {
    router.push(
      `/liquidity/add-liquidity?token0=${t0?.address}&token1=${t1?.address}&version=${poolType.toLowerCase()}${poolType.toLowerCase() === "concentrated" ? `&tickSpacing=${tickSpacing}` : ""}`
    );
  }, [router, t0?.address, t1?.address, poolType, tickSpacing]);

  return (
    <TableRow cols="11" mobileCols={"6"}>
      <th className="lg:col-span-4  col-span-3 text-left">
        {!!t0 && !!t1 && (
          <PoolHeader
            token0={t0}
            token1={t1}
            poolAddress={getAddress(address)}
            poolType={
              poolType === "STABLE"
                ? TPoolType.STABLE
                : poolType === "VOLATILE"
                  ? TPoolType.VOLATILE
                  : TPoolType.CONCENTRATED
            }
          />
        )}
      </th>
      <th className="">
        $<DisplayFormattedNumber num={formatNumber(reserveUSD)} />
      </th>
      <th className="text-blue-light hidden lg:block">
        <DisplayFormattedNumber num={formatNumber(gauge?.rewardRate || 0)} />%
      </th>
      <th className="hidden lg:block">
        $<DisplayFormattedNumber num={formatNumber(totalFeesUSD)} />
      </th>
      <th>
        $<DisplayFormattedNumber num={formatNumber(volumeUSD)} />
      </th>
      <th className="text-left pl-4  lg:col-span-3 ">
        <div className="flex justify-between">
          <span></span>
          <Button
            className="group-hover:bg-neutral-[#303136] hover:bg-[#43444C]"
            onClick={addLiquidityHandler}
          >
            <div className="flex items-center gap-x-1">
              <span>Add</span>
              {!!t0 && !!t1 && (
                <CurrenciesOverlapIcons size="sm" token0={t0} token1={t1} />
              )}
            </div>
          </Button>
        </div>
      </th>
    </TableRow>
  );
}
