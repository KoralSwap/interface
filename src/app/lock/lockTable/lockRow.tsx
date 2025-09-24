import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import logo from "@/assets/reactor-symbol.svg";
import { formatEther } from "viem";
import { formatNumber } from "@/lib/utils";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import Spinner from "@/components/ui/spinner";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { LockPosition } from "@/gql/graphql";
import useDistributorCalls from "@/lib/hooks/distributor/useDistributorCalls";
import useDistributorExecutions from "@/lib/hooks/distributor/useDistributorExecutions";
import useEscrowCalls from "@/lib/hooks/escrow/useEscrowCalls";

enum TokenStatus {
  ACTIVE = "Active",
  INACTIVE = "Not Active",
  EXPIRED = "Expired",
}

interface Props {
  setOpenModal: (open: boolean) => void;
  lockPosition: LockPosition;
  onLockActionMenuClicked: (position: LockPosition) => void;
  onTransactionCompleted?: () => void;
}

export default function LockRow({
  setOpenModal,
  lockPosition,
  onLockActionMenuClicked,
  onTransactionCompleted,
}: Props) {
  const unlockDate = useMemo(
    () => new Date(Number(lockPosition.unlockTime) * 1000),
    [lockPosition.unlockTime]
  );
  const currentDate = useAtomicDate();
  const status = useMemo(() => {
    const lockEnd = new Date(Number(lockPosition) * 1000);
    return lockEnd <= currentDate
      ? TokenStatus.EXPIRED
      : Number(lockPosition.totalVoteWeightGiven) !== 0
        ? TokenStatus.ACTIVE
        : TokenStatus.INACTIVE;
  }, [lockPosition, currentDate]);
  const { useClaimable } = useDistributorCalls();
  const { useGetNFTBalance } = useEscrowCalls();
  const { useClaimForSingle } = useDistributorExecutions();
  const votingPower = useGetNFTBalance({
    tokenId: BigInt(lockPosition.lockId),
    refetchInterval: 30_000,
  });
  const claimable = useClaimable(BigInt(lockPosition.lockId), 30_000);
  const formattedVotingPower = useMemo(
    () => parseFloat(formatEther(votingPower)),
    [votingPower]
  );
  const formattedClaimable = useMemo(
    () => parseFloat(formatEther(claimable)),
    [claimable]
  );
  const apr = useMemo(
    () =>
      parseFloat(lockPosition.position) > 0
        ? (formattedClaimable * 100) / parseFloat(lockPosition.position)
        : 0,
    [formattedClaimable, lockPosition.position]
  );

  const { setToast } = useTransactionToastProvider();

  const { execute, isPending, isError, isSuccess, reset } = useClaimForSingle({
    tokenId: BigInt(lockPosition.lockId),
    onSuccess: (hash) => {
      setToast({
        toastType: "success",
        actionTitle: "Reward claimed",
        actionDescription: "Reward was successfully claimed for lock",
        hash,
      });

      if (onTransactionCompleted) onTransactionCompleted();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
      }),
  });

  useEffect(() => {
    if (isError || isSuccess) reset();
  }, [isError, isSuccess, reset]);

  return (
    <tr className="grid text-center rounded-sm grid-cols-7 lg:grid-cols-8 items-center bg-[#16161d] py-2 px-6">
      <td className="flex gap-x-2 items-center text-left lg:col-span-2">
        <div>
          <Image src={logo} alt="logo" />
        </div>
        <span>Lock ID {lockPosition.lockId}</span>
      </td>
      <td className="">
        <span className="block">
          <DisplayFormattedNumber num={formatNumber(formattedVotingPower)} />{" "}
          veRCT
        </span>
        <span className="block text-neutral-500 text-[12px]">
          Locked{" "}
          <DisplayFormattedNumber num={formatNumber(lockPosition.position)} />{" "}
          RCT
        </span>
      </td>
      <td>
        <span className="text-blue-light">{formatNumber(apr, 4)}%</span>
      </td>
      <td className="">
        <DisplayFormattedNumber num={formatNumber(formatEther(claimable))} />{" "}
        RCT
      </td>
      <td className="">{unlockDate.toDateString()}</td>
      <td className="">
        <Badge
          border="one"
          colors={
            status === TokenStatus.EXPIRED
              ? "yellow"
              : status === TokenStatus.ACTIVE
                ? "success"
                : "error"
          }
        >
          {status}
        </Badge>
      </td>
      <td>
        <div className="flex gap-x-4 justify-end">
          <Button
            onClick={execute}
            disabled={claimable === 0n || isPending}
            variant={"primary"}
            size="sm"
            data-pending={claimable === 0n || isPending ? "true" : "false"}
          >
            {isPending ? <Spinner /> : <span>Claim</span>}
          </Button>
          <Button
            onClick={() => {
              onLockActionMenuClicked(lockPosition);
              setOpenModal(true);
            }}
            variant={"outline"}
            size="sm"
          >
            Manage
          </Button>
        </div>
      </td>
    </tr>
  );
}
