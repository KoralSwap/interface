"use client";

import React from "react";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PoolsTable from "./poolsTable";
import LiquidityInfo from "./liquidityInfo";
import { useTokenlistContext } from "@/contexts/tokenlistContext";
import Link from "next/link";
import { Droplets, PlusCircle, Info } from "lucide-react";

export default function Page() {
  const { tokenlist } = useTokenlistContext();

  return (
    <PageMarginContainer>
      <div className="py-8 px-4 sm:px-0">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-lg shadow-blue-500/30">
              <Droplets size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
              Liquidity
            </h1>
          </div>
          <p className="text-sm sm:text-base text-neutral-400">
            Provide liquidity to earn trading fees and rewards
          </p>
        </div>

        {/* Info Card */}
        <Card variant="gradient" className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Info className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-lg font-bold text-white">
                  Earn Rewards as a Liquidity Provider
                </h2>
                <p className="mb-4 text-sm text-white/80">
                  Liquidity Providers (LPs) make low-slippage swaps possible.
                  Stake liquidity to earn trading fees and additional rewards.
                </p>
                <LiquidityInfo />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-white/70">
                    <span className="font-semibold text-white">
                      {tokenlist.length} tokens
                    </span>{" "}
                    currently listed
                  </p>
                  <Link href="/liquidity/add-liquidity?token0=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&token1=0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f&version=volatile">
                    <Button
                      variant="secondary"
                      className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                    >
                      <PlusCircle size={18} />
                      Deposit Liquidity
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pools Section */}
        <Card variant="elevated" hover="glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="text-blue-400" size={24} />
                All Pools
              </CardTitle>
              <Link href="/liquidity/add-liquidity?token0=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&token1=0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f&version=volatile">
                <Button variant="primary" size="sm">
                  <PlusCircle size={16} />
                  Add Liquidity
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PoolsTable />
          </CardContent>
        </Card>
      </div>
    </PageMarginContainer>
  );
}
