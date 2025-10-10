import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-vis/dist/style.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TransactionToast from "@/components/transactionToast";
import { AppView } from "./__renders";

const jetbrainsMono = JetBrains_Mono({
  weight: ["100", "200", "300", "500", "400", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
  variable: "--jetbrains-font",
});

export const metadata: Metadata = {
  title: "KoralSwap - Next-Gen AMM on Konet Chain",
  description:
    "Trade, provide liquidity, and earn rewards on KoralSwap - the native DEX on Konet chain with lightning-fast transactions and low fees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.svg" />
      </head>
      <body
        className={`text-white bg-background overflow-x-hidden ${jetbrainsMono.className} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <TransactionToast />
          <Header />
          <main className="flex-1">
            <AppView>{children}</AppView>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
