"use client";

import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "@wagmi/core/query";
import { FC, PropsWithChildren } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { TRPCReactProvider } from "@/trpc/react";
import { TokenlistContextProvider } from "@/contexts/tokenlistContext";
import { TransactionToastProvider } from "@/contexts/transactionToastProvider";
import { konet } from "@/lib/chains/konet";
import {
  injectedWallet,
  metaMaskWallet,
  phantomWallet,
  walletConnectWallet,
  rabbyWallet,
  rainbowWallet,
  ramperWallet,
  roninWallet,
  trustWallet,
  tokenPocketWallet,
  tokenaryWallet,
  tahoWallet,
  talismanWallet,
  okxWallet,
  foxWallet,
} from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        phantomWallet,
        metaMaskWallet,
        trustWallet,
        okxWallet,
        walletConnectWallet,
        injectedWallet,
        rabbyWallet,
        rainbowWallet,
        ramperWallet,
        roninWallet,
        tokenPocketWallet,
        tokenaryWallet,
        tahoWallet,
        talismanWallet,
        foxWallet,
      ],
    },
  ],
  {
    appName: "KoralSwap",
    projectId: "75ec6bc09b1280c146d750fbb7aae68a",
  }
);

export const wagmiConfig = createConfig({
  connectors,
  ssr: true,
  chains: [konet],
  transports: {
    [konet.id]: http("https://api.kon-wallet.com"),
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
          <TRPCReactProvider>
            <TokenlistContextProvider>
              <TransactionToastProvider>
                {/* Header goes here */}

                {children}

                {/* Footer goes here */}
              </TransactionToastProvider>
            </TokenlistContextProvider>
          </TRPCReactProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
