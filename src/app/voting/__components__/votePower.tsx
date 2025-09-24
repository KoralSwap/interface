"use client";
import { Button } from "@/components/ui/button";
import React, { useMemo, useState } from "react";
import VoteDialog from "./voteDialog";
import { useAccount } from "wagmi";
import { formatNumber } from "@/lib/utils";
import { Address, formatEther } from "viem";
import { Allocations } from "../types";
import useEscrowCalls from "@/lib/hooks/escrow/useEscrowCalls";

interface Props {
  allocations: Allocations;
  selectedLockId?: bigint;
  disallocateAll: () => void;
  disallocate: (poolAddress: Address) => void;
  allocate: (poolAddress: Address, position: number) => void;
}

export default function VotePower({
  allocations,
  selectedLockId,
  disallocateAll,
  disallocate,
  allocate,
}: Props) {
  const [open, setOpen] = useState(false);
  const { isConnected } = useAccount();
  const totalPercentage = useMemo(
    () =>
      Object.keys(allocations).length
        ? Object.values(allocations).reduce((prev, curr) => prev + curr, 0)
        : 0,
    [allocations]
  );
  const { useGetNFTBalance } = useEscrowCalls();
  const nftBalance = useGetNFTBalance({
    tokenId: selectedLockId ?? 0n,
    refetchInterval: 30000,
  });
  const amount = useMemo(() => {
    const percentage = (totalPercentage * Number(nftBalance)) / 100;
    return BigInt(percentage);
  }, [nftBalance, totalPercentage]);
  return (
    isConnected &&
    !!selectedLockId && (
      <>
        <VoteDialog
          setOpen={setOpen}
          open={open}
          allocate={allocate}
          selectedLockId={selectedLockId}
          allocations={allocations}
          disallocate={disallocate}
        />
        <div className="py-3 z-20 px-6 flex justify-between gap-x-10 w-[520px] fixed rounded-md bottom-8 border border-neutral-950 -translate-x-1/2 left-1/2 items-center bg-neutral-1000">
          <div className="flex gap-x-5 justify-center items-center">
            <span>Voting power used:</span>
            <span className="text-blue-light">
              {formatNumber(totalPercentage)}%
            </span>
            <div className="bg-purple-400/10 text-purple-400 h-10 w-10 flex justify-center items-center rounded-full text-xs px-1 py-1">
              {formatNumber(formatEther(amount))}
            </div>
          </div>
          <div className="flex gap-x-3">
            <Button
              onClick={() => setOpen(true)}
              variant="primary"
              size="md"
              disabled={amount <= 0n}
            >
              Vote
            </Button>
            <button onClick={disallocateAll} className="text-primary-400">
              Reset
            </button>
          </div>
        </div>
      </>
    )
  );
}
