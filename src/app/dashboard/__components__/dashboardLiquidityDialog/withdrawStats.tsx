import React from "react";
import { formatUnits } from "viem";
import { TToken } from "@/lib/types";
import { StatRow } from "./statRow";

interface Props {
  amount0: bigint;
  amount1: bigint;
  token0: TToken | undefined;
  token1: TToken | undefined;
  percent: number | string;
  isLoading?: boolean;
}

export default function WithdrawStats({
  token0,
  token1,
  amount0,
  amount1,
  percent,
  isLoading,
}: Props) {
  return (
    token0 &&
    token1 && (
      <div className="space-y-2">
        <StatRow title="Withdraw" value={String(percent) + "%"} />
        <StatRow
          title={`Withdrawing ${token0.symbol} `}
          value={formatUnits(amount0, token0.decimals ?? 18)}
          isLoading={isLoading}
          formatNum
        />
        <StatRow
          formatNum
          title={`Withdrawing ${token1.symbol} `}
          value={formatUnits(amount1, token1.decimals ?? 18)}
          isLoading={isLoading}
        />
        {/* <StatRow */}
        {/*   title={`Withdrawing ${selectedUserLiquidityPosition?.pair.token1.name} `} */}
        {/*   value={formatUnits( */}
        {/*     data?.[1] ?? 0n, */}
        {/*     Number(selectedUserLiquidityPosition?.pair.token0.decimals) ?? 18 */}
        {/*   )} */}
        {/* /> */}
      </div>
    )
  );
}
