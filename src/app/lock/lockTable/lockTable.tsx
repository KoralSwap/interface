"use client";
import React, { useState } from "react";
import ManageLockDialog from "../manageLockDialog/manageLockDialog";
import LockRow from "./lockRow";
import { LockPosition } from "@/gql/graphql";
import useLockQueries from "@/lib/hooks/envio/useLockQueries";

export default function LockTable() {
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedLockPosition, setSelectedLockPosition] =
    useState<LockPosition>();
  const { useQLGetAccountLockPositions } = useLockQueries();
  const { data: QLAccountLocks, refetch: refetchLocks } =
    useQLGetAccountLockPositions(1000, 60_000); // Fetch locks every minute
  return (
    <>
      <ManageLockDialog
        open={manageDialogOpen}
        setOpen={setManageDialogOpen}
        selectedLockPosition={selectedLockPosition}
        reset={() => setSelectedLockPosition(undefined)}
        onDropdownChange={setSelectedLockPosition}
      />
      <div className="overflow-x-auto">
        <table className="w-full pt-6 min-w-[1100px]">
          <caption className="h-0 opacity-0">Locks Table</caption>
          <thead className="text-neutral-400 text-sm">
            {QLAccountLocks && QLAccountLocks.LockPosition.length > 0 && (
              <tr className="grid grid-cols-7 lg:grid-cols-8 px-6 py-2 font-medium">
                <th className="lg:col-span-2 text-left">Lock ID</th>
                <th>Voting Power</th>
                <th>APR</th>
                <th>Rewards</th>
                <th>Unlock Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            )}
          </thead>

          <tbody className="flex flex-col gap-y-2">
            {(!QLAccountLocks || !QLAccountLocks.LockPosition.length) && (
              <tr className="rounded-sm items-center bg-neutral-1000 py-4 px-4">
                <td>
                  <p className="text-sm text-neutral-400">
                    To receive incentives and fees, you need to create a lock
                    and vote with it.
                  </p>
                </td>
              </tr>
            )}
            {QLAccountLocks &&
              QLAccountLocks.LockPosition.map((lock) => (
                <LockRow
                  key={lock.id}
                  lockPosition={lock as LockPosition}
                  setOpenModal={setManageDialogOpen}
                  onLockActionMenuClicked={setSelectedLockPosition}
                  onTransactionCompleted={refetchLocks}
                />
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
