"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import DashboardLiquidityTable from "./__components__/dashboardLiquidityTable";
import Link from "next/link";
import { Droplets, Activity, PlusCircle, BarChart3 } from "lucide-react";

export default function Dashboard() {
  return (
    <PageMarginContainer>
      <div className="py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Header */}
        <div className="mb-10 md:mb-12 px-4 sm:px-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-lg shadow-blue-500/30">
              <BarChart3 size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
              Dashboard
            </h1>
          </div>
          <p className="text-sm sm:text-base text-neutral-400">
            Track your portfolio, liquidity positions, and rewards
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-10 md:mb-12 px-4 sm:px-0">
          <QuickActionCard
            href="/swap"
            icon={<Activity size={24} />}
            title="Swap Tokens"
            description="Trade tokens instantly"
            gradient="from-blue-500 to-primary-500"
          />
          <QuickActionCard
            href="/liquidity/add-liquidity?token0=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&token1=0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f&version=volatile"
            icon={<PlusCircle size={24} />}
            title="Add Liquidity"
            description="Earn fees as an LP"
            gradient="from-cyan-400 to-blue-500"
          />
        </div>

        {/* Liquidity Positions */}
        <Card
          variant="elevated"
          hover="glow"
          className="mt-10 md:mt-12 mx-4 sm:mx-0"
        >
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <CardTitle className="flex items-center gap-2">
                <Droplets
                  className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6"
                  size={20}
                />
                <span className="text-lg sm:text-xl">Liquidity Positions</span>
              </CardTitle>
              <Link href="/liquidity/add-liquidity?token0=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&token1=0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f&version=volatile">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <PlusCircle size={16} />
                  New Position
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <DashboardLiquidityTable />
          </CardContent>
        </Card>
      </div>
    </PageMarginContainer>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  gradient,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <Card
        variant="default"
        hover="both"
        className="group relative h-full overflow-hidden"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 transition-opacity group-hover:opacity-10`}
        />
        <CardContent className="relative p-6 md:p-8">
          <div className="mb-5 text-blue-400 transition-transform group-hover:scale-110">
            {icon}
          </div>
          <h3 className="mb-3 text-lg md:text-xl font-bold text-white">
            {title}
          </h3>
          <p className="text-sm text-neutral-400">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
