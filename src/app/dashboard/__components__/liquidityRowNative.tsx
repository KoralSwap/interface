import { Badge } from "@/components/ui/badge";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { TPoolType } from "@/lib/types";
import { convertWETHToPlainETHIfApplicable } from "@/utils";
import { useRouter } from "next/navigation";
import { LiquidityActions } from "../types";
import { useCallback, useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import { formatUnits } from "viem";
import { TableRow } from "@/components/ui/table";
import { useChainId } from "wagmi";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import {
  KoralSwapUserPoolData,
  KoralSwapPoolData,
} from "@/lib/hooks/useKoralSwapAPI";
import CurrenciesOverlapIcons from "@/components/shared/currenciesOverlapIcons";
import { useTokenlistContext } from "@/contexts/tokenlistContext";

interface RowProps {
  data: KoralSwapUserPoolData;
  poolData: KoralSwapPoolData | undefined;
  onItemClick: (action: LiquidityActions) => void;
}

export function LiquidityRowNative({ data, poolData, onItemClick }: RowProps) {
  const chainId = useChainId();
  const router = useRouter();
  const { tokenlist } = useTokenlistContext();

  const token0 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() ===
          convertWETHToPlainETHIfApplicable(
            poolData?.token0 || "0x0",
            chainId
          ).toLowerCase()
      ),
    [tokenlist, poolData?.token0, chainId]
  );

  const token1 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() ===
          convertWETHToPlainETHIfApplicable(
            poolData?.token1 || "0x0",
            chainId
          ).toLowerCase()
      ),
    [tokenlist, poolData?.token1, chainId]
  );

  const handleNavigationAddLiquidity = useCallback(() => {
    if (!poolData) return;
    router.push(
      `/liquidity/add-liquidity?token0=${convertWETHToPlainETHIfApplicable(poolData.token0, chainId)}&token1=${convertWETHToPlainETHIfApplicable(poolData.token1, chainId)}&version=${poolData.stable ? "stable" : "volatile"}`
    );
  }, [router, poolData, chainId]);

  const poolType: TPoolType = poolData?.stable
    ? TPoolType.STABLE
    : TPoolType.VOLATILE;

  // Format token amounts
  const token0Amount = useMemo(() => {
    return formatNumber(formatUnits(data.token0Amount, token0?.decimals || 18));
  }, [data.token0Amount, token0]);

  const token1Amount = useMemo(() => {
    return formatNumber(formatUnits(data.token1Amount, token1?.decimals || 18));
  }, [data.token1Amount, token1]);

  const isStaked = data.stakedInGauge > 0n;

  return (
    <TableRow
      cols="6"
      mobileCols={"6"}
      className="grid animate-in fade-in text-center rounded-lg items-center bg-neutral-1000 py-4 px-6 border border-neutral-900/50 hover:border-neutral-800 transition-colors"
    >
      <th className="text-left flex gap-x-4 col-span-2">
        {token0 && token1 && (
          <div className="flex items-center gap-3">
            <CurrenciesOverlapIcons token0={token0} token1={token1} size="md" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">
                  {poolData?.token0Symbol}/{poolData?.token1Symbol}
                </span>
                <Badge
                  size="sm"
                  colors={poolType === TPoolType.STABLE ? "primary" : "success"}
                  border="none"
                >
                  {poolType === TPoolType.STABLE ? "Stable" : "Volatile"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </th>
      <th className="flex justify-center items-center">
        <Badge
          size="sm"
          colors={isStaked ? "success" : "neutral"}
          border="none"
        >
          {isStaked ? "Staked" : "Unstaked"}
        </Badge>
      </th>
      <th className="flex items-center justify-center">
        <span className="text-sm text-neutral-300">
          <DisplayFormattedNumber num={token0Amount} />
        </span>
      </th>
      <th className="flex items-center justify-center">
        <span className="text-sm text-neutral-300">
          <DisplayFormattedNumber num={token1Amount} />
        </span>
      </th>
      <th className="flex items-center justify-end">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="sm">
              <EllipsisIcon size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-neutral-950 border border-neutral-800 rounded-lg p-1 shadow-lg"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="text-sm text-white px-3 py-2 rounded hover:bg-neutral-900 cursor-pointer outline-none"
                onClick={handleNavigationAddLiquidity}
              >
                Add Liquidity
              </DropdownMenu.Item>
              {isStaked && (
                <DropdownMenu.Item
                  className="text-sm text-white px-3 py-2 rounded hover:bg-neutral-900 cursor-pointer outline-none"
                  onClick={() => onItemClick(LiquidityActions.Unstake)}
                >
                  Unstake
                </DropdownMenu.Item>
              )}
              {data.liquidity > 0n && (
                <DropdownMenu.Item
                  className="text-sm text-white px-3 py-2 rounded hover:bg-neutral-900 cursor-pointer outline-none"
                  onClick={() => onItemClick(LiquidityActions.Withdraw)}
                >
                  Withdraw
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </th>
    </TableRow>
  );
}
