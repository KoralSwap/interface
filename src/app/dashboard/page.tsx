"use client";
import React from "react";
import Headers from "@/components/ui/headers";
import { Button } from "@/components/ui/button";
import InnerLabelInput from "./__components__/input";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import DashboardLiquidityTable from "./__components__/dashboardLiquidityTable";
import Link from "next/link";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";

export default function Dashboard() {
  const { width: windowWidth = 0 } = useWindowDimensions();
  // const chainId = useChainId();
  // const { pools } = usePoolslistContext();
  // const rct = useMemo(() => RCT[chainId], [chainId]);
  // const claimable = useMemo(
  //   () =>
  //     pools
  //       .map((pool) => pool.account_gauge_earned)
  //       .reduce((prev, curr) => prev + curr, 0n),
  //   [pools]
  // );
  // const {
  //   quote: [marketQuote],
  // } = useGetMarketQuote({
  //   tokenAddress: rct,
  //   value: claimable,
  //   disabled: false,
  //   refetchInterval: 900000,
  // });
  return (
    <div>
      <PageMarginContainer>
        <Headers.GradiantHeaderOne colorOne="#A0055D" colorTwo="#836EF9">
          Dashboard
        </Headers.GradiantHeaderOne>
        <div className="pt-4"></div>
        <div className="flex flex-col md:flex-row gap-3">
          {/* input part goes here */}
          <InnerLabelInput label="Account" />

          <div className="relative inline-flex items-center justify-between gap-2 rounded-sm border border-neutral-900 bg-transparent px-4 py-2 h-[34px]">
            <span className="text-white text-sm opacity-70">
              Claimable Rewards:
            </span>
            <div className="flex items-center gap-2 justify-between">
              <div className="inline-block text-white text-sm tracking-tighter">
                $0
                {/* ${formatNumber(formatEther(marketQuote))} */}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6"></div>
        <div>
          <div className="flex justify-between">
            <Headers.InfoHeaderTwo
              popupContent={<div>explanation goes here</div>}
            >
              Deposit & Staked Liquidity
            </Headers.InfoHeaderTwo>
            <Link href="/liquidity/deposit">
              <Button
                variant={"primary"}
                size={windowWidth < 601 ? "sm" : "md"}
              >
                New Deposit
              </Button>
            </Link>
          </div>
          <div className="pt-6"></div>
          <DashboardLiquidityTable />
        </div>

        {/* <LockProvider> */}
        {/*   <div className="flex justify-between pt-12"> */}
        {/*     <Headers.InfoHeaderTwo popupContent={<div></div>}> */}
        {/*       Locks */}
        {/*     </Headers.InfoHeaderTwo> */}
        {/**/}
        {/*     <ClaimAllLocks /> */}
        {/*   </div> */}
        {/*   <div className="pt-6"></div> */}
        {/*   <div> */}
        {/*     <LockTable /> */}
        {/*   </div> */}
        {/* </LockProvider> */}
      </PageMarginContainer>
    </div>
  );
}
