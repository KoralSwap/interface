import {
  Address,
  decodeFunctionResult,
  encodeFunctionData,
  zeroAddress,
} from "viem";
import { GaugeType } from "./shared";
import * as V2Gauge from "@/lib/abis/V2Gauge";
import * as CLGauge from "@/lib/abis/CLGauge";
import { useAccount, useCall } from "wagmi";
import { useMemo } from "react";

interface BaseProps {
  gaugeType?: GaugeType;
  address?: Address;
  refetchInterval?: number | false;
}

interface CheckGaugeEarningsProps extends BaseProps {
  tokenId?: bigint;
}

interface GetRewardRateByTSProps extends BaseProps {
  timestamp?: bigint;
}

function composeEarningCallBytes(
  account: Address,
  gaugeType: GaugeType = GaugeType.V2,
  tokenId: bigint = 0n
) {
  const { abi: v2Abi } = V2Gauge;

  if (gaugeType === GaugeType.CL && tokenId > 0n) {
    const { abi: clAbi } = CLGauge;
    return encodeFunctionData({
      abi: clAbi,
      functionName: "earned",
      args: [account, tokenId],
    });
  }
  return encodeFunctionData({
    abi: v2Abi,
    functionName: "earned",
    args: [account],
  });
}

function composeRateCallBytes(gaugeType: GaugeType = GaugeType.V2) {
  const { abi: v2Abi } = V2Gauge;

  if (gaugeType === GaugeType.CL) {
    const { abi: clAbi } = CLGauge;
    return encodeFunctionData({
      abi: clAbi,
      functionName: "rewardRate",
      args: [],
    });
  }
  return encodeFunctionData({
    abi: v2Abi,
    functionName: "rewardRate",
    args: [],
  });
}

function composeRateCallInRangeBytes(
  gaugeType: GaugeType = GaugeType.V2,
  timestamp: bigint = BigInt(Date.now() / 1000)
) {
  const { abi: v2Abi } = V2Gauge;

  if (gaugeType === GaugeType.CL) {
    const { abi: clAbi } = CLGauge;
    return encodeFunctionData({
      abi: clAbi,
      functionName: "rewardRateByEpoch",
      args: [timestamp],
    });
  }
  return encodeFunctionData({
    abi: v2Abi,
    functionName: "rewardRateByEpoch",
    args: [timestamp],
  });
}

function useCheckGaugeEarnings({
  gaugeType = GaugeType.V2,
  address = zeroAddress,
  tokenId = 0n,
  refetchInterval = false,
}: CheckGaugeEarningsProps) {
  const { address: account = zeroAddress } = useAccount();
  const bytes = useMemo(
    () => composeEarningCallBytes(account, gaugeType, tokenId),
    [account, gaugeType, tokenId]
  );
  const {
    isFetching,
    isLoading,
    refetch,
    data: callResult,
  } = useCall({
    to: address,
    data: bytes,
    account,
    query: {
      enabled:
        gaugeType === GaugeType.V2
          ? account !== zeroAddress && address !== zeroAddress
          : account !== zeroAddress && address !== zeroAddress && tokenId > 0n,
      refetchInterval,
    },
  });

  return {
    refresh: refetch,
    data:
      callResult && callResult.data
        ? gaugeType === GaugeType.V2
          ? decodeFunctionResult({
              abi: V2Gauge.abi,
              functionName: "earned",
              data: callResult.data,
            })
          : decodeFunctionResult({
              abi: CLGauge.abi,
              functionName: "earned",
              data: callResult.data,
            })
        : 0n,
    isLoading: isFetching || isLoading,
  };
}

function useCheckGaugeRewardRate({
  gaugeType = GaugeType.V2,
  address = zeroAddress,
  refetchInterval = false,
}: BaseProps) {
  const bytes = useMemo(() => composeRateCallBytes(gaugeType), [gaugeType]);
  const {
    isFetching,
    isLoading,
    refetch,
    data: callResult,
  } = useCall({
    to: address,
    data: bytes,
    query: {
      enabled: address !== zeroAddress,
      refetchInterval,
    },
  });

  return {
    refresh: refetch,
    data:
      callResult && callResult.data
        ? gaugeType === GaugeType.V2
          ? decodeFunctionResult({
              abi: V2Gauge.abi,
              functionName: "rewardRate",
              data: callResult.data,
            })
          : decodeFunctionResult({
              abi: CLGauge.abi,
              functionName: "rewardRate",
              data: callResult.data,
            })
        : 0n,
    isLoading: isFetching || isLoading,
  };
}

function useCheckGaugeRewardRateByTimestamp({
  gaugeType = GaugeType.V2,
  address = zeroAddress,
  refetchInterval = false,
  timestamp = 0n,
}: GetRewardRateByTSProps) {
  const bytes = useMemo(
    () => composeRateCallInRangeBytes(gaugeType, timestamp),
    [gaugeType, timestamp]
  );
  const {
    isFetching,
    isLoading,
    refetch,
    data: callResult,
  } = useCall({
    to: address,
    data: bytes,
    query: {
      enabled: address !== zeroAddress,
      refetchInterval,
    },
  });

  return {
    refresh: refetch,
    data:
      callResult && callResult.data
        ? gaugeType === GaugeType.V2
          ? decodeFunctionResult({
              abi: V2Gauge.abi,
              functionName: "rewardRate",
              data: callResult.data,
            })
          : decodeFunctionResult({
              abi: CLGauge.abi,
              functionName: "rewardRate",
              data: callResult.data,
            })
        : 0n,
    isLoading: isFetching || isLoading,
  };
}

export default function useGaugeCalls() {
  return {
    useCheckGaugeEarnings,
    useCheckGaugeRewardRate,
    useCheckGaugeRewardRateByTimestamp,
  };
}
