// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useCallback, useMemo } from "react";
// import { useAccount } from "wagmi";
// import { QUOTE_REFETCH_INTERVAL } from "@/data/constants";
// import { useSwapProvider } from "@/app/swap/swapProvider";
// import { useNetwork } from "../hooks";
// import { isNativeAddress } from "../utils";
// import { useWrapOrUnwrapOnly } from "./useWrapOrUnwrapOnly";

// export function useLiquidityHubQuote() {
//   const { chainId, address: account } = useAccount();
//   const queryClient = useQueryClient();
//
//   const {
//     state: { inToken, slippage, outToken, liquidityHubDisabled },
//     sdk,
//     parsedInputAmount,
//   } = useSwapProvider();
//   const dexMinAmountOut = "0";
//   const wToken = useNetwork()?.wToken.address;
//   const inTokenAddress = isNativeAddress(inToken?.address)
//     ? wToken
//     : inToken?.address;
//   const outTokenAddress = outToken?.address;
//   // Check if the swap is wrap or unwrap only
//   const { isUnwrapOnly, isWrapOnly } = useWrapOrUnwrapOnly(
//     inTokenAddress,
//     outTokenAddress
//   );
//
//   const queryKey = useMemo(
//     () => [
//       "quote",
//       inTokenAddress,
//       outTokenAddress,
//       parsedInputAmount,
//       slippage,
//       dexMinAmountOut,
//     ],
//     [
//       inTokenAddress,
//       outTokenAddress,
//       parsedInputAmount,
//       slippage,
//       dexMinAmountOut,
//     ]
//   );
//
//   const fetchQuote = useCallback(
//     (signal?: AbortSignal) => {
//       return sdk.getQuote({
//         fromToken: inTokenAddress!,
//         toToken: outTokenAddress!,
//         inAmount: parsedInputAmount!,
//         dexMinAmountOut,
//         account,
//         slippage,
//         signal,
//       });
//     },
//     [
//       sdk,
//       inTokenAddress,
//       outTokenAddress,
//       parsedInputAmount,
//       dexMinAmountOut,
//       account,
//       slippage,
//     ]
//   );
//
//   const query = useQuery({
//     queryKey,
//     queryFn: ({ signal }) => {
//       return fetchQuote(signal);
//     },
//     enabled: Boolean(
//       !liquidityHubDisabled &&
//         chainId &&
//         inTokenAddress &&
//         outTokenAddress &&
//         Number(parsedInputAmount) > 0 &&
//         !isUnwrapOnly &&
//         !isWrapOnly &&
//         account
//     ),
//     refetchOnWindowFocus: false,
//     staleTime: Infinity,
//     gcTime: 0,
//     retry: 2,
//     refetchInterval: QUOTE_REFETCH_INTERVAL,
//     placeholderData: (prev) => prev,
//   });
//
//   const getLatestQuote = useCallback(() => {
//     return queryClient.ensureQueryData({
//       queryKey,
//       queryFn: ({ signal }) => fetchQuote(signal),
//     });
//   }, [queryClient, queryKey, fetchQuote]);
//
//   return {
//     ...query,
//     getLatestQuote,
//   };
// }
