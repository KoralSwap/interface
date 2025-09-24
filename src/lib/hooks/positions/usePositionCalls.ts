import { NFT_POSITION_MANAGER } from "@/data/constants";
import * as NFTPositionManager from "@/lib/abis/V3NFTPositionManager";
import { useEffect, useMemo, useState } from "react";
import { Address, zeroAddress } from "viem";
import { useChainId, useReadContract, useSimulateContract } from "wagmi";
import { useAtomicDate } from "../useAtomicDate";
import { useAtom } from "jotai";
import { transactionDeadlineAtom } from "@/store";

function usePositionCheckAllowance({
  tokenId = 0n,
  spender = zeroAddress,
  refetchInterval = false,
}: {
  tokenId?: bigint;
  spender?: Address;
  refetchInterval?: number | false;
}) {
  const { abi } = NFTPositionManager;
  const chainId = useChainId();
  const nft = useMemo(() => NFT_POSITION_MANAGER[chainId], [chainId]);
  const { data: approvedSpender = zeroAddress, refetch } = useReadContract({
    abi,
    address: nft,
    functionName: "getApproved",
    args: [tokenId],
    query: {
      refetchInterval,
      enabled:
        spender !== zeroAddress && typeof tokenId === "bigint" && tokenId > 0n,
    },
  });
  return {
    isAllowed:
      approvedSpender !== zeroAddress &&
      approvedSpender.toLowerCase() === spender.toLowerCase(),
    refetch,
  };
}

function usePositionQuoteDecreaseLiquidity({
  tokenId = 0n,
  liquidity = 0n,
  refetchInterval = false,
}: {
  tokenId?: bigint;
  liquidity?: bigint;
  refetchInterval?: number | false;
}) {
  const [amount0, setAmount0] = useState(0n);
  const [amount1, setAmount1] = useState(0n);
  const { abi } = NFTPositionManager;
  const chainId = useChainId();
  const nft = useMemo(() => NFT_POSITION_MANAGER[chainId], [chainId]);
  const now = useAtomicDate(10000);
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);

  const { data } = useSimulateContract({
    abi,
    address: nft,
    functionName: "decreaseLiquidity",
    args: [{ tokenId, liquidity, deadline, amount0Min: 0n, amount1Min: 0n }],
    query: { enabled: liquidity > 0n && tokenId > 0n, refetchInterval },
  });

  useEffect(() => {
    if (data && data.result) {
      const [a0, a1] = data.result;
      setAmount0(a0);
      setAmount1(a1);
    }
  }, [data]);

  return { amount0, amount1 };
}

export default function usePositionCalls() {
  return { usePositionCheckAllowance, usePositionQuoteDecreaseLiquidity };
}
