import ManageLockDropdown from "@/app/lock/manageLockDialog/manageLockDropdown";
import React, { useMemo } from "react";
import useLockQueries from "@/lib/hooks/envio/useLockQueries";
import { LockPosition } from "@/gql/graphql";

export default function VoteDropdown({
  setSelectedLockId,
  selectedLockId,
}: {
  setSelectedLockId: (lockId: bigint) => void;
  selectedLockId?: bigint;
}) {
  const { useQLGetAccountLockPositions } = useLockQueries();
  const { data: QLLockPositions } = useQLGetAccountLockPositions(1000, 30000);
  const selectedLockPosition = useMemo(() => {
    if (!QLLockPositions) return;
    if (!selectedLockId) return;
    return QLLockPositions.LockPosition.find(
      (lock) => lock.lockId === selectedLockId.toString()
    );
  }, [QLLockPositions, selectedLockId]);
  return (
    <div>
      {/* TODO: rename ManageLockDropdown */}
      <ManageLockDropdown
        selectedLockPosition={selectedLockPosition as LockPosition}
        onPositionSelected={(lock) => setSelectedLockId(lock?.lockId)}
        lockPositions={(QLLockPositions?.LockPosition as LockPosition[]) || []}
        disabled={!QLLockPositions || QLLockPositions.LockPosition.length === 0}
      />
    </div>
  );
}
