import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import PoolHeader from "@/components/shared/poolHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TPoolType } from "@/lib/types";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useMemo } from "react";
import { Address, formatEther, getAddress, zeroAddress } from "viem";
import { formatNumber } from "@/lib/utils";
import { convertWETHToPlainETHIfApplicable, useGetTokenInfo } from "@/utils";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import Spinner from "@/components/ui/spinner";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import { Allocations } from "../types";
import useLockQueries from "@/lib/hooks/envio/useLockQueries";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import useDistributorCalls from "@/lib/hooks/distributor/useDistributorCalls";
import useEscrowCalls from "@/lib/hooks/escrow/useEscrowCalls";
import useVote from "../__hooks__/useVote";
import { LockPosition } from "@/gql/graphql";
import useVoterCalls from "@/lib/hooks/voter/useVoterCalls";
import useGaugeCalls from "@/lib/hooks/gauges/useGaugeCalls";
import { GaugeType } from "@/lib/hooks/gauges/shared";

interface Props {
  open?: boolean;
  setOpen?: (b: boolean) => void;
  allocations: Allocations;
  selectedLockId?: bigint;
  disallocate: (poolAddress: Address) => void;
  allocate: (poolAddress: Address, position: number) => void;
}

export default function VoteDialog({
  open,
  setOpen,
  allocations,
  selectedLockId,
  disallocate,
  allocate,
}: Props) {
  const { useQLGetAccountLockPositions } = useLockQueries();
  const { data: QLLockPositions } = useQLGetAccountLockPositions(1000, 30000);
  const { useClaimable } = useDistributorCalls();
  const { useGetNFTBalance } = useEscrowCalls();
  const selectedLockPosition = useMemo(() => {
    if (!QLLockPositions) return;
    if (!selectedLockId) return;
    return QLLockPositions.LockPosition.find(
      (lock) => lock.lockId === selectedLockId.toString()
    );
  }, [QLLockPositions, selectedLockId]);
  const nftBalance = useGetNFTBalance({
    tokenId: selectedLockId ?? 0n,
    refetchInterval: 30000,
  });
  const claimable = useClaimable(selectedLockId ?? 0n, 30000);
  const formattedClaimable = useMemo(
    () => parseFloat(formatEther(claimable)),
    [claimable]
  );
  const apr = useMemo(
    () =>
      !!selectedLockPosition && parseFloat(selectedLockPosition.position) > 0
        ? (formattedClaimable * 100) / parseFloat(selectedLockPosition.position)
        : 0,
    [formattedClaimable, selectedLockPosition]
  );
  const lockEndDate = useMemo(
    () => new Date(Number(selectedLockPosition?.unlockTime || 0n) * 1000),
    [selectedLockPosition?.unlockTime]
  );
  const now = useAtomicDate();
  const { setToast } = useTransactionToastProvider();

  const pools = useMemo(
    () => Object.keys(allocations).map((pool) => pool as Address),
    [allocations]
  );
  const weights = useMemo(
    () =>
      Object.keys(allocations).length && !!selectedLockPosition
        ? Object.values(allocations).map((val) => {
            const value = (val * Number(nftBalance)) / 100;
            return BigInt(value);
          })
        : [],
    [allocations, selectedLockPosition, nftBalance]
  );

  const { execute, isError, isPending, isSuccess, reset } = useVote({
    tokenId: selectedLockId ?? 0n,
    pools,
    weights,
    onSuccess: (hash) =>
      setToast({
        toastType: "success",
        actionTitle: "Successfully voted",
        actionDescription: "You have successfully voted with your NFTs",
        hash,
      }),
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  const isValid = useMemo(
    () => pools.length && weights.length,
    [pools, weights]
  );

  useEffect(() => {
    if (isError || isSuccess) reset();
  }, [isError, isSuccess, reset, setToast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="opacity-0 h-0 ">Vote</DialogTitle>
      <DialogContent removeClose className="p-0 max-w-[850px]">
        <button
          onClick={() => setOpen?.(false)}
          className="flex items-center rounded-full h-8 w-8 absolute bg-neutral-950 -right-3 -top-3 justify-center"
        >
          <X size={16} />
        </button>
        <div className="scroll-container overflow-x-auto ">
          <div className="max-h-[70svh] min-w-[800px] scroll-container  space-y-4 overflow-y-auto px-2 py-2 w-full">
            <div className="w-full flex flex-col justify-start items-center">
              <div className="bg-neutral-950 text-sm flex justify-between items-center px-2 py-2 rounded-md w-full">
                <div className="flex justify-start items-center gap-x-3 col-span-2">
                  <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
                  <span>Lock ID {String(selectedLockId)}</span>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col">
                    <span className="block">
                      <DisplayFormattedNumber
                        num={formatNumber(formatEther(nftBalance))}
                        formatNum
                      />{" "}
                      veRCT
                    </span>
                    <span className="block text-neutral-500 text-[12px]">
                      Locked{" "}
                      <DisplayFormattedNumber
                        num={formatNumber(selectedLockPosition?.position)}
                        formatNum
                      />{" "}
                      RCT
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className="text-blue-light">{formatNumber(apr)}%</span>
                </div>
                <div className="flex justify-center">
                  <span className="">
                    {formatNumber(selectedLockPosition?.position)} RCT
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="">{lockEndDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-center">
                  <Badge
                    colors={
                      selectedLockPosition &&
                      selectedLockPosition.totalVoteWeightGiven !== "0" &&
                      lockEndDate > now
                        ? "success"
                        : "error"
                    }
                  >
                    {selectedLockPosition &&
                    selectedLockPosition.totalVoteWeightGiven !== "0" &&
                    lockEndDate > now
                      ? "Active"
                      : "Not Active"}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={execute}
                    disabled={!isValid || isPending}
                  >
                    {isPending ? <Spinner /> : "Vote"}
                  </Button>
                </div>
              </div>
              {selectedLockPosition &&
                pools.map((poolId) => {
                  return (
                    <PoolRow
                      key={poolId}
                      selectedLockPosition={
                        selectedLockPosition as LockPosition
                      }
                      poolId={getAddress(poolId)}
                      allocations={allocations}
                      disallocate={disallocate}
                      allocate={allocate}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// function Row({
//   selectedVotes,
//   nftId,
// }: {
//   nftId: string;
//   selectedVotes: { [id: string]: number };
// }) {
//   return (

//   );
// }

function PoolRow({
  poolId,
  selectedLockPosition,
  disallocate,
  allocate,
  allocations,
}: {
  poolId: Address;
  selectedLockPosition: LockPosition;
  disallocate: (poolAddress: Address) => void;
  allocate: (poolAddress: Address, position: number) => void;
  allocations: Allocations;
}) {
  const value = useMemo(
    () => allocations[poolId.toLowerCase() as Address] || 0,
    [poolId, allocations]
  );
  const { useQLGetAllPools } = usePoolQueries();
  const { usePoolWeights } = useVoterCalls();
  const { useCheckGaugeRewardRate } = useGaugeCalls();
  const { data: QLAllPools } = useQLGetAllPools(1000, 0, 30000);
  const pool = useMemo(() => {
    if (!QLAllPools) return;
    return QLAllPools.Pool.find(
      (pool) => pool.address.toLowerCase() === poolId.toLowerCase()
    );
  }, [QLAllPools, poolId]);
  const token0 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(
      (pool?.token0!.address as Address) ?? zeroAddress
    )
  );
  const token1 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(
      (pool?.token1!.address as Address) ?? zeroAddress
    )
  );
  const { weight: poolWeight } = usePoolWeights({
    pool: poolId,
    refetchInterval: 30000,
  });
  const { data: rewardRate } = useCheckGaugeRewardRate({
    gaugeType: pool?.poolType === "CONCENTRATED" ? GaugeType.CL : GaugeType.V2,
    address: (pool?.gauge?.address as Address) ?? zeroAddress,
    refetchInterval: 30000,
  });

  const handleMaxClick = useCallback(() => {
    if (!selectedLockPosition) return;
    allocate(poolId.toLowerCase() as Address, 100); // Implemented to allocate percentage left if the allocation is very close to being exhausted
  }, [allocate, poolId, selectedLockPosition]);

  return (
    !!pool &&
    !!token0 &&
    !!token1 && (
      <div className="pt-8 w-full">
        <div className="flex justify-between items-center text-sm w-full">
          <div className="relative">
            <button
              onClick={() => disallocate(poolId.toLowerCase() as Address)}
              className="flex items-center rounded-full h-6 w-6 absolute bg-neutral-950 -right-5 -top-3 justify-center"
            >
              <X size={16} />
            </button>
            <PoolHeader
              poolAddress={poolId}
              poolType={
                pool.poolType === "STABLE"
                  ? TPoolType.STABLE
                  : pool.poolType === "VOLATILE"
                    ? TPoolType.VOLATILE
                    : TPoolType.CONCENTRATED
              }
              token0={token0}
              token1={token1}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="">
              <div>
                <span className="text-neutral-400">Votes</span>{" "}
                <DisplayFormattedNumber
                  num={formatNumber(formatEther(poolWeight))}
                  formatNum
                />
              </div>
              <div>
                <span className="text-neutral-400">Total Rewards</span> $
                <DisplayFormattedNumber
                  num={formatNumber(
                    parseFloat(pool.totalFeesUSD) +
                      parseFloat(pool.totalBribesUSD)
                  )}
                  formatNum
                />
              </div>
              <div>
                <span className="text-neutral-400">APR</span>{" "}
                <DisplayFormattedNumber
                  num={formatNumber(formatEther(rewardRate))}
                  formatNum
                />
                %
              </div>
            </div>
          </div>
          <div>
            <div className="text-neutral-400">Est. Rewards</div>
            <div>
              $
              <DisplayFormattedNumber
                num={formatNumber(pool.totalBribesUSD)}
                formatNum
              />
            </div>
          </div>
          <div>
            <div className="text-neutral-400">Voting Power</div>
            <div>{formatNumber(formatEther(poolWeight))} veRCT</div>
          </div>
          <div className="flex justify-end items-start ">
            <div className="bg-neutral-950 justify-between rounded-md p-2 flex gap-x-2">
              <div className="flex gap-x-1">
                <input
                  placeholder="0"
                  value={value}
                  type="number"
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const v = !isNaN(e.target.valueAsNumber)
                      ? e.target.valueAsNumber
                      : allocations[poolId.toLowerCase() as Address] || 0;
                    allocate(poolId.toLowerCase() as Address, v);
                  }}
                  className="w-[40px] focus:ring-transparent transition-all  bg-transparent"
                />
                <span className="text-neutral-400">%</span>
              </div>
              <button
                onClick={handleMaxClick}
                className="text-primary-400 disabled:text-neutral-500"
              >
                Max
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex gap-x-2">
            <Button
              onClick={() => allocate(poolId.toLowerCase() as Address, 0)}
              size="sm"
            >
              0%
            </Button>
            <Button
              onClick={() => allocate(poolId.toLowerCase() as Address, 25)}
              size="sm"
            >
              25%
            </Button>
            <Button
              onClick={() => allocate(poolId.toLowerCase() as Address, 50)}
              size="sm"
            >
              50%
            </Button>
            <Button
              onClick={() => allocate(poolId.toLowerCase() as Address, 75)}
              size="sm"
            >
              75%
            </Button>
            <Button
              onClick={() => allocate(poolId.toLowerCase() as Address, 100)}
              size="sm"
            >
              100%
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
