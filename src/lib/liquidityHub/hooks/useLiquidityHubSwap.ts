// import { _TypedDataEncoder } from "@ethersproject/hash";
// import { Quote } from "@orbs-network/liquidity-hub-sdk";
// import { useMutation } from "@tanstack/react-query";
// import { useSignTypedData } from "wagmi";
// import { useLiquidityHubQuote } from "./useLiquidityHubQuote";
// import { useSwapProvider } from "@/app/swap/swapProvider";
// import { promiseWithTimeout } from "../utils";

export const isRejectedError = (error: Error) => {
  const message = error.message?.toLowerCase();
  return message?.includes("rejected") || message?.includes("denied");
};

// export function useLiquidityHubSwapCallback() {
//   // updateSwapProgressState: (values: Partial<SwapProgressState>) => void
//   const {
//     sdk: liquidityHub,
//     state: { inToken },
//     updateState,
//   } = useSwapProvider();
//   // TODO
//   // IMPL PARASWAP
//   // const buildParaswapTxCallback = useParaswapBuildTxCallback();
//   // const optimalRate = useOptimalRate().data;
//   const { getLatestQuote, data: quote } = useLiquidityHubQuote();
//   // const { mutateAsync: wrap } = useWrapToken();
//   // const { mutateAsync: approve } = useApproveAllowance();
//   const { mutateAsync: sign } = useSign();
//
//   const inTokenAddress = inToken?.address;
//
//   return useMutation({
//     mutationFn: async () => {
//       // Fetch latest quote just before swap
//       if (!inTokenAddress) {
//         throw new Error("In token address is not set");
//       }
//
//       if (!quote) {
//         throw new Error("Quote or optimal rate is not set");
//       }
//       // Set swap status for UI
//       // updateSwapProgressState({ swapStatus: SwapStatus.LOADING });
//
//       try {
//         // Check if the inToken needs approval for allowance
//
//         // updateSwapProgressState({ steps });
//
//         // Fetch the latest quote again after the approval
//         let latestQuote = quote;
//         try {
//           const result = await getLatestQuote();
//           if (result) {
//             latestQuote = result;
//           }
//         } catch (error) {
//           console.error(error);
//         }
//         updateState({ acceptedQuote: latestQuote });
//
//         // Set the current step to swap
//         // updateSwapProgressState({ currentStep: SwapSteps.Swap });
//
//         // Sign the transaction for the swap
//         let signature = "";
//         try {
//           liquidityHub.analytics.onSignatureRequest();
//           signature = await sign(latestQuote);
//           liquidityHub.analytics.onSignatureSuccess(signature);
//           updateState({ signature });
//         } catch (error) {
//           liquidityHub.analytics.onSignatureFailed((error as Error).message);
//           throw error;
//         }
//
//         // Pass the liquidity provider txData if possible
//         // let paraswapTxData: TransactionParams | undefined;
//
//         console.log("Swapping...", latestQuote);
//         // Call Liquidity Hub sdk swap and wait for transaction hash
//         const txHash = await liquidityHub.swap(
//           latestQuote,
//           signature as string
//           // {
//           //   data: paraswapTxData?.data,
//           //   to: paraswapTxData?.to,
//           // }
//         );
//
//         if (!txHash) {
//           throw new Error("Swap failed");
//         }
//
//         // Fetch the successful transaction details
//         await liquidityHub.getTransactionDetails(txHash, latestQuote);
//
//         console.log("Swapped");
//         // updateSwapProgressState({ swapStatus: SwapStatus.SUCCESS });
//       } catch (error) {
//         if (isRejectedError(error as Error)) {
//           // updateSwapProgressState({ swapStatus: undefined });
//         } else {
//           // updateSwapProgressState({ swapStatus: SwapStatus.FAILED });
//           throw error;
//         }
//       }
//     },
//   });
// }
//
// const useSign = () => {
//   const { signTypedDataAsync } = useSignTypedData();
//   return useMutation({
//     mutationFn: async (quote: Quote) => {
//       // Encode the payload to get signature
//       const { permitData } = quote;
//       const populated = await _TypedDataEncoder.resolveNames(
//         permitData.domain,
//         permitData.types,
//         permitData.values,
//         async (name: string) => name
//       );
//       const payload = _TypedDataEncoder.getPayload(
//         populated.domain,
//         permitData.types,
//         populated.value
//       );
//
//       const signature = await promiseWithTimeout<string>(
//         signTypedDataAsync(payload),
//         40_000
//       );
//
//       console.log("Transaction signed", signature);
//       return signature;
//     },
//   });
// };
