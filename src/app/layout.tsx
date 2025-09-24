import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-vis/dist/style.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/header";
import TransactionToast from "@/components/transactionToast";
import { AppView } from "./__renders";

const jetbrainsMono = JetBrains_Mono({
  weight: ["100", "200", "300", "500", "400", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
  variable: "--jetbrains-font",
});

export const metadata: Metadata = {
  title: "Reactor Finance",
  description: "Native DEX on Monad chain.",
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
        className={`text-white bg-background  overflow-x-hidden ${jetbrainsMono.className} antialiased`}
      >
        <Providers>
          <TransactionToast />
          <Header />
          <main>
            <AppView>{children}</AppView>
          </main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
