"use client";
import React from "react";

import barChart from "@/assets/bar-chart.svg";
import coin from "@/assets/coin.svg";
import house from "@/assets/house.svg";

import Image, { StaticImageData } from "next/image";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import useStatistics from "@/lib/hooks/envio/useStatistics";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";

export default function LiquidityInfo() {
  const { data: QLStats } = useStatistics(60000);
  return (
    <div className="grid gap-x-4 md:grid-cols-3 border-b border-neutral-900 gap-y-2 pb-4">
      <InfoCard
        title="TVL"
        value={formatNumber(
          QLStats?.Statistics_by_pk?.totalVolumeLockedUSD ?? 0
        )}
        icon={house}
      />
      <InfoCard
        title="Fees"
        value={formatNumber(QLStats?.Statistics_by_pk?.totalFeesUSD ?? 0)}
        icon={coin}
      />
      <InfoCard
        title="Volume"
        value={formatNumber(
          QLStats?.Statistics_by_pk?.totalTradeVolumeUSD ?? 0
        )}
        icon={barChart}
      />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  value: string;
  title: string;
  icon: StaticImageData;
}) {
  return (
    <Card bg="950" className="py-[10px] px-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-primary-400 text-sm">{title}</h4>
          $<DisplayFormattedNumber num={value} />
        </div>
        <div>
          <Image src={icon} alt="Total Value Locked Icon" />
        </div>
      </div>
    </Card>
  );
}
