import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import symbol from "@/assets/reactor-symbol.svg";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import PoolHeader from "@/components/shared/poolHeader";
import { TPoolType } from "@/lib/types";
import { convertWETHToPlainETHIfApplicable, useGetTokenInfo } from "@/utils";
import { useRouter } from "next/navigation";
import { LiquidityActions } from "../types";
import { useCallback, useEffect, useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import { Address, formatEther, getAddress, zeroAddress } from "viem";
import { TableRow } from "@/components/ui/table";
import { useChainId } from "wagmi";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import Spinner from "@/components/ui/spinner";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { type LiquidityPosition } from "@/gql/graphql";
import useGaugeCalls from "@/lib/hooks/gauges/useGaugeCalls";
import { GaugeType } from "@/lib/hooks/gauges/shared";
import useGaugeExecutions from "@/lib/hooks/gauges/useGaugeExecutions";

interface RowProps {
  data: LiquidityPosition;
  onItemClick: (action: LiquidityActions) => void;
}

export function LiquidityRow({ data, onItemClick }: RowProps) {
  const chainId = useChainId();
  const router = useRouter();
  // const t0 = params.get("token0");
  //  const t1 = params.get("token1");
  //  const version = params.get("version");
  const handleNavigationAddLiquidity = useCallback(() => {
    router.push(
      `/liquidity/add-liquidity?token0=${convertWETHToPlainETHIfApplicable(getAddress(data.pool!.token0!.address), chainId)}&token1=${convertWETHToPlainETHIfApplicable(getAddress(data.pool!.token1!.address), chainId)}&version=${data.pool?.poolType.toLowerCase()}${data.pool?.poolType.toLowerCase() === "concentrated" ? `&positionId=${data.clPositionTokenId}&tickSpacing=${data.pool.tickSpacing}` : ""}`
    );
  }, [router, data.pool, data.clPositionTokenId, chainId]);

  const token0 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(
      (data.pool?.token0?.address as Address) ?? zeroAddress,
      chainId
    )
  );
  const token1 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(
      (data.pool?.token1?.address as Address) ?? zeroAddress,
      chainId
    )
  );

  const depositedUSD = useMemo(() => {
    const position = parseFloat(data.position);
    const totalSupply = parseFloat(data.pool?.totalSupply || "0");
    const reserveUSD = parseFloat(data.pool?.reserveUSD || "0");
    const percentage = totalSupply > 0 ? position / totalSupply : position / 1;
    return percentage * reserveUSD;
  }, [data]);
  const isInRange = useMemo(
    () => Number(data.pool?.gaugeFeesUSD ?? "0") > 0,
    [data]
  );
  const { useCheckGaugeEarnings } = useGaugeCalls();
  const { data: earnings, refresh: refreshGaugeEarnings } =
    useCheckGaugeEarnings({
      gaugeType:
        data.pool?.poolType !== "CONCENTRATED" ? GaugeType.V2 : GaugeType.CL,
      address: getAddress(data.pool?.gauge?.address ?? zeroAddress),
      tokenId: !data.clPositionTokenId
        ? undefined
        : BigInt(data.clPositionTokenId),
      refetchInterval: 60_000,
    });
  const earningsUSD = useMemo(() => {
    const derivedUSD = parseFloat(
      data.pool?.gauge?.rewardToken?.derivedUSD ?? "0"
    );
    return derivedUSD * Number(earnings);
  }, [data, earnings]);
  // const claimGaugeRewards = useClaimGaugeRewards({
  //   gauge: (data.pool?.gauge?.address as Address) ?? zeroAddress,
  // });
  const { setToast } = useTransactionToastProvider();

  const { useGetReward } = useGaugeExecutions();
  const { execute, isPending, reset, isError, isSuccess } = useGetReward({
    gaugeType:
      data.pool?.poolType !== "CONCENTRATED" ? GaugeType.V2 : GaugeType.CL,
    address: getAddress(data.pool?.gauge?.address ?? zeroAddress),
    tokenId: !data.clPositionTokenId
      ? undefined
      : BigInt(data.clPositionTokenId),
    onSuccess: (hash) => {
      setToast({
        hash,
        actionTitle: "Successfully claimed gauge rewards",
        actionDescription:
          "You have successfully claimed rewards for this pool.",
        toastType: "success",
      });

      void refreshGaugeEarnings();
    },
    onError(err) {
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription:
          "You have successfully claimed rewards for this pool.",
        toastType: "error",
      });
    },
  });

  useEffect(() => {
    if (isError || isSuccess) reset();
  }, [isError, isSuccess, reset]);

  // Refresh queries every 30 secs
  // useSetInterval(() => {
  //   queryClient.invalidateQueries({ queryKey });
  // }, 30000);

  return (
    <TableRow
      cols="7"
      mobileCols={"7"}
      className="grid animate-in fade-in  text-center rounded-sm  items-center bg-neutral-1000 py-2 px-6"
    >
      <td className=" text-left col-span-2">
        <div className="flex items-center justify-start gap-4">
          <PoolHeader
            token0={token0}
            token1={token1}
            poolAddress={getAddress(data.pool!.address)}
            poolType={
              data.pool?.poolType === "STABLE"
                ? TPoolType.STABLE
                : data.pool?.poolType === "VOLATILE"
                  ? TPoolType.VOLATILE
                  : TPoolType.CONCENTRATED
            }
          />
        </div>
      </td>
      <td className="flex-col gap-y-1 flex justify-center items-center">
        <Badge
          className="inline-block px-4 h-fit py-[6px] text-center"
          border="none"
          colors={isInRange ? "success" : "error"}
          size="sm"
        >
          {isInRange ? "In Range" : "Out Of Range"}
        </Badge>
        <div className="flex items-center justify-center gap-1">
          <div
            data-range={isInRange ? "yes" : "no"}
            className="h-2 w-2 data-[range=yes]:bg-success-400 data-[range=no]:bg-error-400 rounded-full "
            color={isInRange ? "#4ade80" : "#f87171"}
          />
          <div
            data-range={isInRange ? "yes" : "no"}
            className="text-[10px] data-[range=no]:text-neutral-500"
          >
            {isInRange ? "Earning Emissions" : "Not Earning Emissions"}
          </div>
        </div>
      </td>
      <td className="text-sm block">
        $<DisplayFormattedNumber num={formatNumber(depositedUSD)} />
      </td>
      {/* <RangeColumn pair={pair_address} /> */}
      <td className="text-blue-light block text-sm">
        <DisplayFormattedNumber
          num={formatNumber(formatEther(data.pool?.gauge?.rewardRate ?? 0))}
        />
        %
      </td>
      <td className="flex-col flex items-center justify-center">
        <div className="flex items-center gap-[9px]">
          <Image
            className="inline-block"
            src={symbol}
            width={20}
            height={20}
            alt="Reactor Ticker"
          />
          <span className="text-sm">
            <DisplayFormattedNumber num={formatNumber(formatEther(earnings))} />
          </span>
        </div>
        <span className="text-sm text-neutral-400">
          $
          <DisplayFormattedNumber
            num={formatNumber(formatEther(BigInt(earningsUSD)))}
          />
        </span>
      </td>
      <td>
        <div className="flex gap-x-2 justify-end">
          <Button
            disabled={true}
            variant={"primary"}
            className="disabled:group-hover:bg-neutral-900 "
            size="xs"
            onClick={execute}
          >
            {isPending ? <Spinner /> : "Claim"}
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" className="flex items-center gap-0.5">
                <span className="p-0.5">Manage</span>
                <EllipsisIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-neutral-950 rounded-sm p-2">
              <DropdownMenu.Item
                onClick={handleNavigationAddLiquidity}
                className="hover:bg-neutral-900 outline-none pl-3 py-2 pr-9 rounded-sm hover:cursor-pointer"
              >
                Increase
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => onItemClick(LiquidityActions.Stake)}
                className="hover:bg-neutral-900 outline-none pl-3 py-2 pr-9 rounded-sm hover:cursor-pointer"
              >
                Stake
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => onItemClick(LiquidityActions.Withdraw)}
                className="hover:bg-neutral-900 outline-none pl-3 py-2 pr-9 rounded-sm hover:cursor-pointer"
              >
                Withdraw
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => onItemClick(LiquidityActions.Unstake)}
                className="hover:bg-neutral-900 outline-none pl-3 py-2 pr-9 rounded-sm hover:cursor-pointer"
              >
                Unstake
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </td>
    </TableRow>
  );
}
