import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import verified from "@/assets/verified.svg";
import info from "@/assets/info.svg";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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
        className="md:w-[440px] mx-0 md:mx-[4px] w-[98vw] overflow-hidden border-none bg-neutral-1000  p-0 text-white"
      >
        <div className="relative  h-[80vh] space-y-6 pt-4 text-white">
          <div className="space-y-6 px-6">
            <DialogTitle className="">Select a token</DialogTitle>
            <SearchInput setValue={setSearchQuery} value={searchQuery} />
          </div>
          <div className="relative z-0 h-[calc(100%-179px)] border-t border-gray-600  ">
            <h2 className="py-3 text-[14px] text-[#999999] pl-6">
              Tokens ({filteredListEdited.length})
            </h2>
            <div className=" h-[calc(100%-22px)] space-y-2 scrollbar overflow-y-auto pb-2 px-2">
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

          <div className="z-10  rounded-bl-md  border-t border-gray-600  bg-[#1a1a1a] px-10 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Image src={verified} alt="verified icon" />
                <span className="font-geistMono text-[12px] md:text-sm text-gray-300">
                  Only show verified tokens
                </span>
                <Image src={info} alt="info" />
              </div>
              <Switch id="airplane-mode" />
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
      className="mb-2 hover:bg-neutral-900 transition-colors flex w-full text-left justify-between rounded-md bg-neutral-950 px-4 py-2"
    >
      <div className="flex items-center gap-x-2">
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
          <div>
            <span>{token.symbol}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">{token.name}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center font-geistMono">
        {/* <div> */}
        {/*   <span>{formatNumber(formatUnits(0n, token.decimals))}</span> */}
        {/* </div> */}
        <div className="flex items-center">
          {token.import && (
            <Button role="banner" variant={"primary"} size={"sm"}>
              Import
            </Button>
          )}
        </div>
        <div>
          {/* {quoteLoading ? ( */}
          {/*   <Spinner /> */}
          {/* ) : ( */}
          {/*   <span className="text-gray-400"> */}
          {/*     ${formatNumber(formatEther(quote[0]))} */}
          {/*   </span> */}
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
