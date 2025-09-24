import { NFT_POSITION_MANAGER } from "@/data/constants";
import * as NFTPositionManager from "@/lib/abis/V3NFTPositionManager";
import { transactionDeadlineAtom } from "@/store";
import {
  SendTransactionErrorType,
  WaitForTransactionReceiptErrorType,
} from "@wagmi/core";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { Address, encodeFunctionData, maxUint128, zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAtomicDate } from "../useAtomicDate";

interface BaseProps {
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (
    err: SendTransactionErrorType | WaitForTransactionReceiptErrorType
  ) => void;
}

interface ApprovalProps extends BaseProps {
  spender?: Address;
  tokenId: bigint;
}

interface DecreaseLPProps extends BaseProps {
  tokenId?: bigint;
  liquidity?: bigint;
}

function composeSetApprovalBytes(spender: Address, tokenId: bigint) {
  const { abi } = NFTPositionManager;
  return encodeFunctionData({
    abi,
    functionName: "approve",
    args: [spender, tokenId],
  });
}

function composeDecreaseLPBytes(
  tokenId: bigint,
  liquidity: bigint,
  recipient: Address,
  deadline: bigint
) {
  const { abi } = NFTPositionManager;
  const decreaseLiquidityBytes = encodeFunctionData({
    abi,
    functionName: "decreaseLiquidity",
    args: [{ tokenId, liquidity, deadline, amount0Min: 0n, amount1Min: 0n }],
  });
  const collectBytes = encodeFunctionData({
    abi,
    functionName: "collect",
    args: [
      { tokenId, recipient, amount0Max: maxUint128, amount1Max: maxUint128 },
    ],
  });
  return encodeFunctionData({
    abi,
    functionName: "multicall",
    args: [[decreaseLiquidityBytes, collectBytes]],
  });
}

function usePositionSetApproval({
  tokenId,
  spender = zeroAddress,
  onError,
  onSuccess,
}: ApprovalProps) {
  const chainId = useChainId();
  const nft = useMemo(() => NFT_POSITION_MANAGER[chainId], [chainId]);
  const bytes = useMemo(
    () => composeSetApprovalBytes(spender, tokenId),
    [spender, tokenId]
  );

  const {
    sendTransaction,
    data: hash,
    error: sendError,
    isError: sendErrored,
    reset,
  } = useSendTransaction();

  const {
    isError: waitErrored,
    isLoading: isPending,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({ hash });
  const execute = useCallback(
    () =>
      sendTransaction({
        data: bytes,
        to: nft,
      }),
    [sendTransaction, bytes, nft]
  );

  useEffect(() => {
    if (isSuccess && hash && onSuccess) {
      onSuccess(hash);
    }

    if ((sendErrored || waitErrored) && (sendError || waitError) && onError) {
      if (sendError) onError(sendError);
      if (waitError) onError(waitError);
    }
  }, [
    isSuccess,
    hash,
    onSuccess,
    sendErrored,
    waitErrored,
    sendError,
    waitError,
    onError,
  ]);
  return {
    execute,
    hash,
    isError: sendErrored || waitErrored,
    isPending,
    isSuccess,
    reset,
  };
}

function usePositionDecreaseLiquidity({
  tokenId = 0n,
  liquidity = 0n,
  onError,
  onSuccess,
}: DecreaseLPProps) {
  const chainId = useChainId();
  const nft = useMemo(() => NFT_POSITION_MANAGER[chainId], [chainId]);
  const now = useAtomicDate(10000);
  const [txDeadline] = useAtom(transactionDeadlineAtom);
  const { address = zeroAddress } = useAccount();
  const deadline = useMemo(() => {
    const ttl = Math.floor(now.getTime() / 1000) + Number(txDeadline) * 60;
    return BigInt(ttl);
  }, [now, txDeadline]);
  const bytes = useMemo(
    () => composeDecreaseLPBytes(tokenId, liquidity, address, deadline),
    [address, deadline, liquidity, tokenId]
  );

  const {
    sendTransaction,
    data: hash,
    error: sendError,
    isError: sendErrored,
    reset,
  } = useSendTransaction();

  const {
    isError: waitErrored,
    isLoading: isPending,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({ hash });
  const execute = useCallback(() => {
    if (tokenId > 0n && liquidity > 0n)
      sendTransaction({
        data: bytes,
        to: nft,
      });
  }, [tokenId, liquidity, sendTransaction, bytes, nft]);

  useEffect(() => {
    if (isSuccess && hash && onSuccess) {
      onSuccess(hash);
    }

    if ((sendErrored || waitErrored) && (sendError || waitError) && onError) {
      if (sendError) onError(sendError);
      if (waitError) onError(waitError);
    }
  }, [
    isSuccess,
    hash,
    onSuccess,
    sendErrored,
    waitErrored,
    sendError,
    waitError,
    onError,
  ]);
  return {
    execute,
    hash,
    isError: sendErrored || waitErrored,
    isPending,
    isSuccess,
    reset,
  };
}

export default function usePositionExecutions() {
  return { usePositionSetApproval, usePositionDecreaseLiquidity };
}
