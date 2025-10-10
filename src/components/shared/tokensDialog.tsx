import React, { useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import SearchInput from "@/components/shared/searchInput";
import ImageWithFallback from "@/components/shared/imageWithFallback";
import { TToken } from "@/lib/types";
import { useTokenlistContext } from "@/contexts/tokenlistContext";
import { useChainId, useReadContracts } from "wagmi";
import { Address, erc20Abi, getAddress } from "viem";
import { Button } from "../ui/button";
import { importedTokensAtom } from "@/store";
import { useAtom } from "jotai";
// import { useGetBalance } from "@/lib/hooks/useGetBalance";
// import { useGetMarketQuote } from "@/lib/hooks/useGetMarketQuote";

export default function TokensDialog({
  open,
  onOpen,
  onTokenSelected,
  selectedTokens,
}: {
  open?: boolean;
  onOpen?: (b: boolean) => void;
  onTokenSelected: (token: TToken) => void;
  selectedTokens: `0x${string}`[];
}) {
  const chainId = useChainId();
  const { filteredList, setSearchQuery, searchQuery } = useTokenlistContext();
  useEffect(() => {
    // reset search after leaving dialog
    if (!open) {
      setTimeout(() => setSearchQuery(""), 300);
    }
  }, [open, setSearchQuery]);
  const { data } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        functionName: "decimals",
        address: searchQuery as Address,
      },
      {
        abi: erc20Abi,
        functionName: "symbol",
        address: searchQuery as Address,
      },
      {
        abi: erc20Abi,
        address: searchQuery as Address,
        functionName: "name",
      },
    ],
    query: {
      enabled: searchQuery.length === 42,
    },
  });

  const foundToken = useMemo(() => {
    if (!data) return;
    const [decimals, symbol, name] = data;
    if (!decimals.result || !symbol.result || !name.result) return;
    try {
      const address = getAddress(searchQuery);
      return {
        symbol: symbol.result,
        name: name.result,
        address,
        logoURI: "",
        decimals: decimals.result,
        chainId,
        import: true,
      };
    } catch {
      return undefined;
    }
  }, [chainId, data, searchQuery]);
  const filteredListEdited = useMemo(() => {
    if (foundToken)
      return [...filteredList, foundToken].filter(
        (token) => !selectedTokens.includes(token.address)
      );
    else
      return filteredList.filter(
        (token) => !selectedTokens.includes(token.address)
      );
  }, [filteredList, foundToken, selectedTokens]);
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent
        title="Search Tokens"
        className="md:w-[440px] mx-0 md:mx-[4px] w-[98vw] overflow-hidden border border-neutral-900 bg-neutral-1050 p-0 text-white"
      >
        <div className="relative h-[80vh] text-white">
          <div className="space-y-4 p-6 border-b border-neutral-900">
            <DialogTitle className="text-xl font-bold">
              Select a token
            </DialogTitle>
            <SearchInput setValue={setSearchQuery} value={searchQuery} />
          </div>
          <div className="relative z-0 h-[calc(100%-120px)]">
            <h2 className="px-6 py-3 text-sm font-medium text-neutral-400">
              Tokens ({filteredListEdited.length})
            </h2>
            <div className="h-[calc(100%-48px)] space-y-1 scrollbar overflow-y-auto pb-2 px-4">
              {filteredListEdited.map((token) => {
                return (
                  <TokenItem
                    token={token}
                    selectToken={(token) => {
                      onTokenSelected(token);
                      if (onOpen) onOpen(false);
                    }}
                    key={token.address}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TokenItem({
  token,
  selectToken,
}: {
  token: TToken;
  selectToken: (token: TToken) => void;
}) {
  // n+1 problem
  // https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it
  // need backend endpoint that returns portfolio of token bals
  // instead of querying each token
  // const balance = useGetBalance({ tokenAddress: token.address });

  const [importedTokens, setImportedTokens] = useAtom(importedTokensAtom);
  return (
    <div
      role="button"
      onClick={() => {
        if (token.import) {
          setImportedTokens([...importedTokens, { ...token, import: false }]);
        }
        selectToken(token);
      }}
      className="flex w-full items-center justify-between rounded-lg border border-transparent bg-neutral-1000 px-4 py-3 text-left transition-all duration-200 hover:border-blue-500/50 hover:bg-neutral-950 cursor-pointer"
    >
      <div className="flex items-center gap-x-3">
        <ImageWithFallback
          className="h-10 w-10 rounded-full"
          src={token.logoURI}
          width={40}
          height={40}
          avatar={{
            letter: token.symbol[0].toUpperCase(),
          }}
          alt={token.symbol}
        />
        <div>
          <div className="font-medium text-white">{token.symbol}</div>
          <div className="text-sm text-neutral-400">{token.name}</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {token.import && (
          <Button role="banner" variant="primary" size="xs">
            Import
          </Button>
        )}
      </div>
    </div>
  );
}
