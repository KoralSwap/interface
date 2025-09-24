"use client";
import { LiquidityRow } from "./liquidityRow";
import { useMemo, useState } from "react";
import { LiquidityActions, StateType } from "../types";
import usePadLoading from "@/lib/hooks/usePadLoading";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import { type LiquidityPosition } from "@/gql/graphql";
import DashboardLiquidityDialog from "./dashboardLiquidityDialog/dashboardLiquidityDialog";

export default function DashboardLiquidityTable() {
  // const chainId = useChainId();
  // const queryClient = useQueryClient();
  const { useQLGetAccountLPPositions } = usePoolQueries();
  const { data: QLALP, isFetching: QLALPFetching } = useQLGetAccountLPPositions(
    1000,
    60000
  );
  const activeLPs = useMemo(
    () => (QLALP?.LiquidityPosition ? QLALP.LiquidityPosition : []),
    [QLALP]
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
    value: QLALPFetching,
    duration: 300,
  });
  return (
    <>
      {stateType && selectedLP && (
        <DashboardLiquidityDialog
          state={stateType}
          position={selectedLP as LiquidityPosition}
          onOpenChange={(isOpen) =>
            setStateType((s) => ({ ...s, dialogOpen: isOpen }))
          }
        />
      )}
      {!isLoadingPadded && activeLPs.length > 0 && (
        <div className="overflow-x-auto scroll-container">
          <table className="w-full min-w-[1000px] pt-6 mx-auto">
            <caption className="h-0 opacity-0">Pools Table</caption>
            <thead className="text-neutral-400 text-sm">
              <tr className="grid grid-cols-7 px-6 py-2 font-medium">
                <th className="col-span-2 text-left">Pool Name</th>
                <th className=" ">Status</th>
                <th className=" ">Value</th>
                <th className=" ">APR</th>
                <th className=" ">Rewards</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="flex flex-col space-y-2 min-h-[52px]">
              {!isLoadingPadded &&
                activeLPs.map((lp, index) => (
                  <LiquidityRow
                    key={lp.id}
                    data={lp as LiquidityPosition}
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
        <div className="text-start text-sm rounded-sm bg-neutral-1000 font-normal text-neutral-400 p-4">
          To receive emissions{" "}
          <Link
            href="/liquidity/deposit"
            className="underline decoration-gray-500 font-semibold cursor-pointer text-white"
          >
            deposit and stake
          </Link>{" "}
          your liquidity first.
        </div>
      )}
    </>
  );
}
