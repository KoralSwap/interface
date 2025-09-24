import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import Spinner from "@/components/ui/spinner";
import useLockQueries from "@/lib/hooks/envio/useLockQueries";
import useDistributorExecutions from "@/lib/hooks/distributor/useDistributorExecutions";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";

export default function ClaimAllLocks() {
  const { useQLGetAccountLockPositions } = useLockQueries();
  const { data: QLAccountLocks } = useQLGetAccountLockPositions(1000, 30_000);
  const tokenIds = useMemo(() => {
    if (!QLAccountLocks) return [];
    return QLAccountLocks.LockPosition.map((lock) => BigInt(lock.lockId));
  }, [QLAccountLocks]);
  const { setToast } = useTransactionToastProvider();

  const { useClaimForMany } = useDistributorExecutions();
  const { execute, isError, isPending, isSuccess, reset } = useClaimForMany({
    tokenIds,
    onSuccess: (hash) =>
      setToast({
        toastType: "success",
        actionTitle: "Rewards claimed",
        actionDescription: "Rewards claimed for all lock positions",
        hash,
      }),
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  const { isConnected } = useAccount();

  useEffect(() => {
    if (isError || isSuccess) reset();
  }, [isError, isSuccess, reset]);

  const { width: windowWidth = 0 } = useWindowDimensions();

  return (
    isConnected && (
      <Button
        onClick={execute}
        disabled={isPending || tokenIds.length === 0}
        variant={"primary"}
        size={windowWidth < 601 ? "sm" : "md"}
      >
        {isPending ? <Spinner /> : <span>Claim Locks Rewards</span>}
      </Button>
    )
  );
}
