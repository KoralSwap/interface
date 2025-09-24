import React, { useCallback } from "react";
import LockDropdown from "../lockDropdown";
import { formatNumber } from "@/lib/utils";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { LockPosition } from "@/gql/graphql";

export default function ManageLockDropdown({
  selectedLockPosition,
  onPositionSelected,
  lockPositions,
  disabled = false,
}: {
  selectedLockPosition: LockPosition | undefined;
  onPositionSelected: (token?: LockPosition) => void;
  lockPositions: readonly LockPosition[];
  disabled?: boolean;
}) {
  const now = useAtomicDate();

  const lockPeriod = useCallback(
    (endTime: bigint) => {
      const nowSeconds = Math.floor(now.getTime() / 1000);
      const difference = Number(endTime) - nowSeconds;
      return difference >= 0 ? secondsToDays(difference) : 0;
    },
    [now]
  );

  return (
    <LockDropdown.Root
      disabled={disabled}
      onValueChange={(value) => {
        onPositionSelected(
          lockPositions.find((token) => token.lockId.toString() === value)
        );
      }}
      value={selectedLockPosition?.lockId.toString()}
    >
      <LockDropdown.Trigger disabled={disabled}>
        {selectedLockPosition ? (
          <>
            Lock #{selectedLockPosition?.lockId.toString()}{" "}
            <span className="text-neutral-200 text-xs">
              {formatNumber(selectedLockPosition.position)} RCT locked for{" "}
              {lockPeriod(BigInt(selectedLockPosition.unlockTime))} days{" "}
            </span>
          </>
        ) : (
          <div>Select a lock</div>
        )}
      </LockDropdown.Trigger>

      <LockDropdown.SelectList>
        {lockPositions.map((token) => (
          <LockDropdown.Item key={token.id} value={token.lockId.toString()}>
            Lock #{token.lockId.toString()}{" "}
            <span className="text-neutral-200 text-sm">
              {formatNumber(token.position)} RCT locked for{" "}
              {lockPeriod(BigInt(token.unlockTime))} days{" "}
            </span>
          </LockDropdown.Item>
        ))}
      </LockDropdown.SelectList>
    </LockDropdown.Root>
  );
}

function secondsToDays(seconds: number): number {
  return Math.floor(seconds / (60 * 60 * 24));
}
