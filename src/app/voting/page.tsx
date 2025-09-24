"use client";
import SearchInput from "@/components/shared/searchInput";
import Headers from "@/components/ui/headers";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useMemo, useState } from "react";
import VoteTable from "./__components__/voteTable";
import VotePower from "./__components__/votePower";
import VoteDropdown from "./__components__/voteDropdown";
import { formatNumber } from "@/lib/utils";
import { Address } from "viem";
// import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { CustomCountdown } from "@/components/ui/countdown";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import useVoterCalls from "@/lib/hooks/voter/useVoterCalls";
import { Allocations } from "./types";
import { TIME } from "@/data/constants";

export default function Page() {
  const { useEpochStart } = useVoterCalls();
  const { useQLGetAllPools } = usePoolQueries();
  const { data: QLAllPools } = useQLGetAllPools(1000, 0, 30000);
  const [fees, incentives] = useMemo(() => {
    if (!QLAllPools) return [0, 0] as [number, number];
    const fees = QLAllPools.Pool.reduce(
      (prev, curr) => parseFloat(curr.totalFeesUSD) + prev,
      0
    );
    const incentives = QLAllPools.Pool.reduce(
      (prev, curr) => parseFloat(curr.totalBribesUSD) + prev,
      0
    );
    return [fees, incentives] as [number, number];
  }, [QLAllPools]);
  const currentEpoch = useEpochStart();
  const endsIn = useMemo(() => {
    const week = BigInt(TIME.WEEK);
    return (currentEpoch + week) * 1000n;
  }, [currentEpoch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedLockId, setSelectedLockId] = useState<bigint>();
  const [allocations, setAllocations] = useState<Allocations>(
    {} as Allocations
  );

  const allocate = useCallback(
    (poolId: Address, percentage: number) => {
      // Calculate how much allocation is left to get to a 100%
      const allocated = Object.values(allocations).reduce(
        (prev, curr) => prev + curr,
        0
      );
      const left = allocations[poolId]
        ? 100 - (allocated - allocations[poolId])
        : 100 - allocated;
      setAllocations((allo) => ({
        ...allo,
        [poolId]: percentage <= left ? percentage : left,
      }));
    },
    [allocations, setAllocations]
  );

  const disallocate = useCallback(
    (poolId: Address) =>
      setAllocations((allo) => {
        return Object.fromEntries(
          Object.entries(allo).filter(
            ([key]) => key.toLowerCase() !== poolId.toLowerCase()
          )
        );
      }),
    [setAllocations]
  );
  const disallocateAll = useCallback(() => {
    setAllocations({});
  }, [setAllocations]);

  return (
    <PageMarginContainer>
      <div className="rounded-lg flex flex-col sm:flex-row justify-between items-stretch  gap-y-6 sm:gap-y-0 sm:gap-x-16">
        <div className="text-left h-[120px] sm:w-1/2">
          <Headers.GradiantHeaderOne colorOne="#A0055D" colorTwo="#836EF9">
            Vote
          </Headers.GradiantHeaderOne>
          <p className=" pt-8 text-sm text-neutral-500">
            Use your veRCT to vote for directing emissions to your desired
            pools. Deposit voting incentives to encourage others to do the same.
          </p>
        </div>

        <div className=" space-y-2 flex flex-col justify-between ">
          <div className="flex justify-between gap-x-6">
            <p className="text-neutral-400 text-sm">Total Fees</p>
            <p className="text-neutral-100 text-sm">
              $
              <DisplayFormattedNumber num={formatNumber(fees)} />
            </p>
          </div>
          <div className="flex justify-between gap-x-6">
            <p className="text-neutral-400 text-sm">Total Incentives:</p>
            <p className="text-neutral-100 text-sm">
              $
              <DisplayFormattedNumber num={formatNumber(incentives)} />
            </p>
          </div>
          <div className="flex justify-between gap-x-6">
            <p className="text-neutral-400 text-sm">Total Rewards:</p>
            <p className="text-neutral-100 text-sm">
              $
              <DisplayFormattedNumber num={formatNumber(fees + incentives)} />
            </p>
          </div>
          <CustomCountdown
            targetDate={Number(endsIn)}
            render={({ days, hours, minutes, seconds, isCompleted }) => (
              <div className="flex justify-between gap-x-6">
                <p className="text-neutral-400 text-sm">
                  Current epoch ends in:
                </p>
                {!isCompleted ? (
                  <p className="text-neutral-100 text-sm">
                    {days}:{hours}:{minutes}:{seconds}
                  </p>
                ) : (
                  <p className="text-neutral-100 text-sm">Completed</p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="pt-12"></div>
      <div className="flex lg:justify-between lg:items-center flex-col lg:flex-row">
        <h2 className="text-xl md:text-2xl">Pools</h2>

        <div className="flex justify-end pt-4 items-center">
          {/* <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value={"all"}>All</TabsTrigger>
              <TabsTrigger value={"stable"}>Most Rewarded</TabsTrigger>
              <TabsTrigger value={"vol"}>My Votes</TabsTrigger>
            </TabsList>
          </Tabs> */}
          <div className="gap-x-4 flex flex-col lg:flex-row gap-y-4 justify-start items-center lg:items-start max-sm:w-full">
            <div className="md:w-[340px] w-full">
              <SearchInput
                className="bg-neutral-950 "
                value={searchQuery}
                setValue={setSearchQuery}
              />
            </div>
            <div className="md:w-[380px] w-full">
              <VoteDropdown
                selectedLockId={selectedLockId}
                setSelectedLockId={setSelectedLockId}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4"></div>
      <div className="">
        <VotePower
          allocations={allocations}
          disallocateAll={disallocateAll}
          selectedLockId={selectedLockId}
          disallocate={disallocate}
          allocate={allocate}
        />
        <VoteTable
          searchQuery={searchQuery}
          allocations={allocations}
          allocate={allocate}
          selectedLockId={selectedLockId}
        />
      </div>
    </PageMarginContainer>
  );
}
