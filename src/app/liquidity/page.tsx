"use client";
import React from "react";
import Headers from "@/components/ui/headers";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PoolsTable from "./poolsTable";
import LiquidityInfo from "./liquidityInfo";
import { useTokenlistContext } from "@/contexts/tokenlistContext";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";

export default function Page() {
  const { tokenlist } = useTokenlistContext();
  const { width: windowWidth = 0 } = useWindowDimensions();
  return (
    <PageMarginContainer>
      <Headers.GradiantHeaderOne colorOne="#A0055D" colorTwo="#836EF9">
        Liquidity
      </Headers.GradiantHeaderOne>
      <div className="pt-6"></div>
      <Card bg="1000" className="p-6 space-y-4">
        <div>
          <h2 className="text-[16px]">
            Liquidity Providers (LPs) make low-slippage swaps possible.
          </h2>
          <h3 className="text-neutral-200 text-sm">
            Stake liquidity to earn trading fees and rewards.
          </h3>
        </div>
        <LiquidityInfo />
        <div className="flex justify-between items-center">
          <h4 className="text-[13px] text-neutral-500 hidden md:block">
            There are currently{" "}
            <span className="text-neutral-200">{tokenlist.length} tokens</span>{" "}
            listed.{" "}
            <span className="underline text-neutral-300">View Tokens</span> or{" "}
            <span className="underline text-neutral-300">List new token</span>
          </h4>
          <a
            href="/liquidity/deposit"
            className={windowWidth < 601 ? "w-full" : undefined}
          >
            <Button variant="filled" className="w-full">
              Deposit Liquidity
            </Button>
          </a>
        </div>
      </Card>
      <div className="pt-12"></div>
      <h2 className="text-2xl">Pools</h2>
      <PoolsTable />
    </PageMarginContainer>
  );
}
