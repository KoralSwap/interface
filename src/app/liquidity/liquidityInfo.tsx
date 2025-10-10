"use client";
import React from "react";

import coin from "@/assets/coin.svg";
import house from "@/assets/house.svg";

import Image, { StaticImageData } from "next/image";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import useKoralSwapAPI from "@/lib/hooks/useKoralSwapAPI";
import { formatUnits } from "viem";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";

export default function LiquidityInfo() {
  const { useGetProtocolInfo } = useKoralSwapAPI();
  const { protocolInfo } = useGetProtocolInfo(60000);

  const tvl = protocolInfo?.tvl
    ? formatNumber(formatUnits(protocolInfo.tvl, 18))
    : "0";

  const fees = protocolInfo?.totalFees
    ? formatNumber(formatUnits(protocolInfo.totalFees, 18))
    : "0";

  return (
    <div className="grid gap-x-4 md:grid-cols-2 border-b border-neutral-900 gap-y-2 pb-4">
      <InfoCard title="TVL" value={tvl + " KON"} icon={house} />
      <InfoCard title="Fees" value={fees + " KON"} icon={coin} />
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
          <DisplayFormattedNumber num={value} />
        </div>
        <div>
          <Image src={icon} alt="Total Value Locked Icon" />
        </div>
      </div>
    </Card>
  );
}
