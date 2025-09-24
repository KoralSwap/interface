import React, { useMemo } from "react";
import { StatRow } from "./statRow";
import { TToken } from "@/lib/types";
import { formatUnits } from "viem";

interface Props {
  action: "stake" | "unstake";
  percent: number | string;
  token0: TToken | undefined;
  token1: TToken | undefined;
  balance0: bigint;
  balance1: bigint;
  tokenId?: bigint;
}

export default function StakeStats({
  percent,
  token0,
  token1,
  balance0,
  balance1,
  action,
  tokenId,
}: Props) {
  const a = useMemo(
    () => (balance0 * BigInt(percent)) / 100n,
    [balance0, percent]
  );
  const b = useMemo(
    () => (balance1 * BigInt(percent)) / 100n,
    [balance1, percent]
  );
  const verb = useMemo(
    () => (action === "stake" ? "To stake" : "To unstake"),
    [action]
  );

  return (
    <div className="space-y-2">
      <StatRow
        title={action === "stake" ? "Stake" : "Unstake"}
        value={String(percent) + "%"}
      />
      {!tokenId ? (
        <>
          <StatRow
            title={verb + " " + token0?.symbol}
            formatNum
            value={`${formatUnits(a, token0?.decimals ?? 18)} ${token0?.symbol}`}
          />
          <StatRow
            formatNum
            title={verb + " " + token1?.symbol}
            value={`${formatUnits(b, token1?.decimals ?? 18)} ${token1?.symbol}`}
          />
        </>
      ) : (
        <StatRow
          title={verb + " NFT position"}
          value={`Position ID: ${String(tokenId)}`}
        />
      )}
    </div>
  );
}
