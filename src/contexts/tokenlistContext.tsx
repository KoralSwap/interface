"use client";

import { TToken } from "@/lib/types";
import { importedTokensAtom } from "@/store";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useChainId } from "wagmi";

interface TokenlistContextType {
  tokenlist: TToken[];
  filteredList: TToken[];
  loading: boolean;
  hasError?: boolean | null;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const TokenlistContext = createContext<TokenlistContextType>({
  tokenlist: [],
  filteredList: [],
  loading: false,
  hasError: null,
  setSearchQuery: console.log,
  searchQuery: "",
});

export const TokenlistContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chainId = useChainId();
  const [importedTokens] = useAtom(importedTokensAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: tokenlist = [],
    isLoading: loading,
    error,
  } = api.tokens.getTokens.useQuery({ chainId });
  const filteredTokenlist = useMemo(() => {
    const tokens = [...tokenlist].filter(
      (token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    const importedList = importedTokens.filter(
      (token) => !tokens.find((t) => t.address === token.address)
    );
    return [...tokens, ...importedList];
  }, [importedTokens, searchQuery, tokenlist]);
  return (
    <TokenlistContext.Provider
      value={{
        tokenlist,
        filteredList: filteredTokenlist,
        loading,
        hasError: Boolean(error),
        setSearchQuery,
        searchQuery,
      }}
    >
      {children}
    </TokenlistContext.Provider>
  );
};

export function useTokenlistContext() {
  return useContext(TokenlistContext);
}
