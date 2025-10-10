"use client";
import { LiquidityRowNative } from "./liquidityRowNative";
import { useMemo, useState } from "react";
import { LiquidityActions, StateType } from "../types";
import usePadLoading from "@/lib/hooks/usePadLoading";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import useKoralSwapAPI from "@/lib/hooks/useKoralSwapAPI";
import DashboardLiquidityDialogNative from "./dashboardLiquidityDialog/dashboardLiquidityDialogNative";

export default function DashboardLiquidityTable() {
  const { useGetAllPoolsData, useGetUserPositions } = useKoralSwapAPI();

  // Get all pools first
  const { pools: allPools, isFetching: poolsFetching } = useGetAllPoolsData(
    100,
    0,
    60000
  );

  // Extract pool addresses
  const poolAddresses = useMemo(
    () => allPools.map((pool) => pool.pool),
    [allPools]
  );

  // Get user positions
  const { positions, isFetching: positionsFetching } = useGetUserPositions(
    poolAddresses,
    60000
  );

  const activeLPs = useMemo(
    () =>
      positions.filter((pos) => pos.liquidity > 0n || pos.stakedInGauge > 0n),
    [positions]
  );
  const [selectedLPIndex, setSelectedLPIndex] = useState(0);
  const selectedLP = useMemo(
    () => activeLPs[selectedLPIndex],
    [activeLPs, selectedLPIndex]
  );
  const [stateType, setStateType] = useState<StateType>({
    dialogOpen: false,
    actionType: LiquidityActions.Stake,
  });
  const isLoadingPadded = usePadLoading({
    value: poolsFetching || positionsFetching,
    duration: 300,
  });

  // Get pool data for each position
  const positionsWithPoolData = useMemo(() => {
    return activeLPs.map((position) => {
      const poolData = allPools.find((pool) => pool.pool === position.pool);
      return { position, poolData };
    });
  }, [activeLPs, allPools]);

  return (
    <>
      {stateType && selectedLP && (
        <DashboardLiquidityDialogNative
          state={stateType}
          position={selectedLP}
          poolData={positionsWithPoolData[selectedLPIndex]?.poolData}
          onOpenChange={(isOpen) =>
            setStateType((s) => ({ ...s, dialogOpen: isOpen }))
          }
        />
      )}
      {!isLoadingPadded && activeLPs.length > 0 && (
        <div className="overflow-x-auto scroll-container">
          <table className="w-full min-w-[1000px] pt-4 mx-auto">
            <caption className="h-0 opacity-0">Pools Table</caption>
            <thead className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <tr className="grid grid-cols-6 px-6 py-4 border-b border-neutral-900">
                <th className="col-span-2 text-left">Pool</th>
                <th className="text-center">Stake Status</th>
                <th className="text-center">Token0 Deposited</th>
                <th className="text-center">Token1 Deposited</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="flex flex-col space-y-3 min-h-[52px] pt-4">
              {!isLoadingPadded &&
                positionsWithPoolData.map(({ position, poolData }, index) => (
                  <LiquidityRowNative
                    key={position.pool}
                    data={position}
                    poolData={poolData}
                    onItemClick={(actionType) => {
                      setSelectedLPIndex(index);
                      setStateType({ actionType, dialogOpen: true });
                    }}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
      {isLoadingPadded && (
        <div className=" w-full  h-[52px] flex items-center justify-center">
          <Spinner height="24px" width="24px" />
        </div>
      )}
      {!activeLPs.length && !isLoadingPadded && (
        <div className="text-center text-sm rounded-lg border border-neutral-900 bg-neutral-1000/30 p-10 md:p-12 mt-4">
          <p className="text-neutral-400 mb-3 text-base">
            No liquidity positions found
          </p>
          <p className="text-sm text-neutral-500">
            To receive emissions{" "}
            <Link
              href="/liquidity/deposit"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline"
            >
              deposit and stake
            </Link>{" "}
            your liquidity first.
          </p>
        </div>
      )}
    </>
  );
}
