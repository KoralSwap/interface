import Headers from "@/components/ui/headers";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import PoolTabs from "./__components__/poolTabs";
import LiquidityCardWrapper from "./__components__/liquidityCardWrapper";

export default function Page() {
  return (
    <PageMarginContainer className="container px-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <div>
          <div>
            <Link
              href="/liquidity"
              className="flex text-sm gap-x-2 items-center hover:text-primary-400 transition-colors"
            >
              <span>
                <ChevronLeft className="w-5 h-5" />
              </span>
              <span>All Pools</span>
            </Link>
          </div>
          <div className="pt-6"></div>
          <Headers.GradiantHeaderOne colorOne="#A0055D" colorTwo="#836EF9F2">
            Add liquidity
          </Headers.GradiantHeaderOne>
        </div>

        <div className="sm:self-start">
          <PoolTabs />
        </div>
      </div>
      <div className="mt-8 sm:mt-12">
        <LiquidityCardWrapper />
      </div>
    </PageMarginContainer>
  );
}
