import { Address, zeroAddress } from "viem";
import * as Voter from "@/lib/abis/Voter";
import { VOTER } from "@/data/constants";
import { useBlockNumber, useChainId, useReadContract } from "wagmi";
import { useEffect, useMemo, useState } from "react";

function useGaugeForPool({
  pool = zeroAddress,
  refetchInterval = false,
}: {
  pool?: Address;
  refetchInterval?: number | false;
}) {
  const { abi } = Voter;
  const chainId = useChainId();
  const voter = useMemo(() => VOTER[chainId], [chainId]);
  const [gauge, setGauge] = useState<Address>(zeroAddress);
  const { data: gaugeAddress = zeroAddress, refetch } = useReadContract({
    abi,
    address: voter,
    functionName: "gauges",
    args: [pool],
    query: {
      enabled: pool !== zeroAddress && gauge === zeroAddress,
      refetchInterval,
    },
  });

  useEffect(() => setGauge(gaugeAddress), [gaugeAddress]);
  return { gauge, refetch };
}

function usePoolWeights({
  pool = zeroAddress,
  refetchInterval = false,
}: {
  pool?: Address;
  refetchInterval?: number | false;
}) {
  const { abi } = Voter;
  const chainId = useChainId();
  const voter = useMemo(() => VOTER[chainId], [chainId]);
  const { data: weight = 0n, refetch } = useReadContract({
    abi,
    address: voter,
    functionName: "weights",
    args: [pool],
    query: {
      enabled: pool !== zeroAddress,
      refetchInterval,
    },
  });

  return { weight, refetch };
}

function useEpochNext() {
  const { abi } = Voter;
  const chainId = useChainId();
  const voter = useMemo(() => VOTER[chainId], [chainId]);
  const { data: blockNumber = 0n } = useBlockNumber();
  const { data: epochNext = 0n } = useReadContract({
    abi,
    address: voter,
    functionName: "epochNext",
    args: [blockNumber],
  });
  return epochNext;
}

function useEpochStart() {
  const { abi } = Voter;
  const chainId = useChainId();
  const voter = useMemo(() => VOTER[chainId], [chainId]);
  const { data: blockNumber = 0n } = useBlockNumber();
  const { data: epochNext = 0n } = useReadContract({
    abi,
    address: voter,
    functionName: "epochStart",
    args: [blockNumber],
  });
  return epochNext;
}

export default function useVoterCalls() {
  return { useGaugeForPool, usePoolWeights, useEpochNext, useEpochStart };
}
