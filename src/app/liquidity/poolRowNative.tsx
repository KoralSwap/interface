import CurrenciesOverlapIcons from "@/components/shared/currenciesOverlapIcons";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table";
import { TPoolType } from "@/lib/types";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTokenlistContext } from "@/contexts/tokenlistContext";
import { formatNumber } from "@/lib/utils";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { convertWETHToPlainETHIfApplicable } from "@/utils";
import { useChainId } from "wagmi";
import { formatUnits } from "viem";
import useKoralSwapAPI, {
  KoralSwapPoolData,
} from "@/lib/hooks/useKoralSwapAPI";
import { Badge } from "@/components/ui/badge";

interface RowProps {
  data: KoralSwapPoolData;
}

export default function PoolRowNative({ data }: RowProps) {
  const chainId = useChainId();
  const router = useRouter();
  const { tokenlist } = useTokenlistContext();
  const { useGetPoolTVL } = useKoralSwapAPI();

  // Get TVL in KON terms
  const { poolTVL } = useGetPoolTVL(data.pool, 60000);

  const t0 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() ===
          convertWETHToPlainETHIfApplicable(data.token0, chainId).toLowerCase()
      ),
    [tokenlist, data.token0, chainId]
  );

  const t1 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() ===
          convertWETHToPlainETHIfApplicable(data.token1, chainId).toLowerCase()
      ),
    [tokenlist, data.token1, chainId]
  );

  const poolType: TPoolType = data.stable
    ? TPoolType.STABLE
    : TPoolType.VOLATILE;

  const addLiquidityHandler = useCallback(() => {
    router.push(
      `/liquidity/add-liquidity?token0=${t0?.address}&token1=${t1?.address}&version=${TPoolType[poolType].toLowerCase()}`
    );
  }, [router, t0?.address, t1?.address, poolType]);

  // Format TVL in KON terms
  const tvl = useMemo(() => {
    if (!poolTVL) return "0";
    return formatNumber(formatUnits(poolTVL, 18));
  }, [poolTVL]);

  const isGaugeAlive = data.gaugeWeight > 0n;

  return (
    <TableRow cols="11" mobileCols={"6"}>
      <th className="lg:col-span-4 col-span-3 text-left">
        {!!t0 && !!t1 && (
          <div className="flex items-center gap-3">
            <CurrenciesOverlapIcons token0={t0} token1={t1} size="md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {data.token0Symbol}/{data.token1Symbol}
                </span>
                <Badge
                  size="sm"
                  colors={poolType === TPoolType.STABLE ? "primary" : "success"}
                  border="none"
                >
                  {poolType === TPoolType.STABLE ? "Stable" : "Volatile"}
                </Badge>
              </div>
              <span className="text-xs text-neutral-500">
                Pool: {data.pool.slice(0, 6)}...
                {data.pool.slice(-4)}
              </span>
            </div>
          </div>
        )}
      </th>
      <th className="">
        <span className="text-sm">
          <DisplayFormattedNumber num={tvl} /> KON
        </span>
      </th>
      <th className="hidden lg:block text-sm">
        <span className="text-blue-400">
          {Number(formatUnits(data.gaugeRewardRate, 18)) > 0
            ? formatNumber(formatUnits(data.gaugeRewardRate, 18)) + "%"
            : "0%"}
        </span>
      </th>
      <th className="hidden lg:flex justify-end text-sm">
        <span className="text-neutral-300">
          <DisplayFormattedNumber
            num={formatNumber(formatUnits(data.reserve0, t0?.decimals || 18))}
          />
        </span>
      </th>
      <th className="hidden lg:flex justify-end text-sm">
        <span className="text-neutral-300">
          <DisplayFormattedNumber
            num={formatNumber(formatUnits(data.reserve1, t1?.decimals || 18))}
          />
        </span>
      </th>
      <th className="hidden lg:block lg:col-span-3 pl-4">
        <div className="flex justify-start gap-2">
          <Button
            onClick={addLiquidityHandler}
            variant="primary"
            size="xs"
            className="text-xs"
          >
            Add Liquidity
          </Button>
          {isGaugeAlive && (
            <Badge
              size="sm"
              colors="success"
              border="none"
              className="px-2 py-1"
            >
              Gauge Active
            </Badge>
          )}
        </div>
      </th>
    </TableRow>
  );
}
