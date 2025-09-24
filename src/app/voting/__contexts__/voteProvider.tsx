"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Address } from "viem";

type Allocations = {
  [key: Address]: number;
};

interface VoteContextType {
  selectedVeNFT: bigint | undefined;
  setSelectedVeNFT: React.Dispatch<React.SetStateAction<bigint | undefined>>;
  allocations: Allocations;
  allocate: (poolId: Address, percentage: number) => void;
  disallocate: (poolId: Address) => void;
  disallocateAll: () => void;
}

const VoteContext = createContext<VoteContextType>({} as VoteContextType);
interface Props {
  children: React.ReactNode;
}

export const VoteProvider = ({ children }: Props) => {
  const [selectedVeNFT, setSelectedVeNFT] = useState<bigint>();
  const [allocations, setAllocations] = useState<Allocations>(
    {} as Allocations
  );
  const allocate = useCallback(
    (poolId: Address, percentage: number) => {
      // Calculate how much allocation is left to get to a 100%
      const allocated = Object.values(allocations).reduce(
        (prev, curr) => prev + curr,
        0
      );
      const left = allocations[poolId]
        ? 100 - (allocated - allocations[poolId])
        : 100 - allocated;
      setAllocations((allo) => ({
        ...allo,
        [poolId]: percentage <= left ? percentage : left,
      }));
    },
    [allocations, setAllocations]
  );
  const disallocate = useCallback(
    (poolId: Address) =>
      setAllocations((allo) => {
        return Object.fromEntries(
          Object.entries(allo).filter(
            ([key]) => key.toLowerCase() !== poolId.toLowerCase()
          )
        );
      }),
    [setAllocations]
  );
  const disallocateAll = useCallback(() => {
    setAllocations({});
  }, [setAllocations]);
  return (
    <VoteContext.Provider
      value={{
        allocate,
        selectedVeNFT,
        disallocate,
        allocations,
        setSelectedVeNFT,
        disallocateAll,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

// Custom hook to use the context
export const useVoteProvider = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVoteProvider must be used within a VoteProvider");
  }
  return context;
};
