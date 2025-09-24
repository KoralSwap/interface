import { Card } from "@/components/ui/card";
import React from "react";

export default function StatCard() {
  return (
    <Card className="p-4 items-center gap-x-4 flex">
      <div className="flex items-center gap-x-2 pr-6">
        {/* <CurrenciesOverlapIcons */}
        {/*   tokenOne={{ */}
        {/*     alt: "", */}
        {/*     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", */}
        {/*   }} */}
        {/*   tokenTwo={{ */}
        {/*     alt: "", */}
        {/*     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", */}
        {/*   }} */}
        {/* /> */}
        <h2 className="text-neutral-100">ETH/USDC</h2>
      </div>
      <div className="h-10 w-[2px] bg-neutral-700"></div>
      <Stat title="24hr High" value="3145.24" />
      <div className="h-10 w-[2px] bg-neutral-700"></div>
      <Stat title="24hr Low" value="3145.24" />
      <div className="h-10 w-[2px] bg-neutral-700"></div>
      <Stat title="TVL" value="3145.24" />
    </Card>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h4 className="text-neutral-300 text-sm">{title}</h4>
      <h4 className="text-neutral-100">{value}</h4>
    </div>
  );
}
