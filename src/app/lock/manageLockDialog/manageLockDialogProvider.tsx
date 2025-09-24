"use client";
import { Contracts } from "@/lib/contracts";
import React, { createContext, useContext, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
export type TLockToken = {
  decimals: number;
  voted: boolean;
  attachments: bigint;
  id: bigint;
  amount: bigint;
  voting_amount: bigint;
  rebase_amount: bigint;
  lockEnd: bigint;
  vote_ts: bigint;
  votes: readonly {
    pair: `0x${string}`;
    weight: bigint;
  }[];
  account: `0x${string}`;
  token: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: bigint;
};
interface ManageLockDialogProviderType {
  lockTokens: readonly TLockToken[];
  selectedTokenId: string;
  setSelectedTokenId: React.Dispatch<React.SetStateAction<string>>;
}

const LiquidityContext = createContext<
  ManageLockDialogProviderType | undefined
>(undefined);
interface Props {
  children: React.ReactNode;
}

export const ManageLockDialogProvider = ({ children }: Props) => {
  const { address } = useAccount();
  const { data: tokens } = useReadContract({
    ...Contracts.veNFTHelper,
    functionName: "getNFTFromAddress",
    args: [address ?? "0x"],
    query: {
      enabled: Boolean(address),
    },
  });
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");
  console.log({ selectedTokenId });
  return (
    <LiquidityContext.Provider
      value={{
        setSelectedTokenId,
        selectedTokenId,
        lockTokens: tokens ?? [],
      }}
    >
      {children}
    </LiquidityContext.Provider>
  );
};

// Custom hook to use the context
export const useManageLockDialogProvider = () => {
  const context = useContext(LiquidityContext);
  if (!context) {
    throw new Error(
      "useManageLockDialogProvider must be used within a MyProvider"
    );
  }
  return context;
};
