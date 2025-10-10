import { defineChain } from "viem";

export const konet = defineChain({
  id: 17217,
  name: "Konet Mainnet",
  network: "konet",
  nativeCurrency: {
    decimals: 18,
    name: "KONET",
    symbol: "KONET",
  },
  rpcUrls: {
    default: {
      http: ["https://api.kon-wallet.com"],
    },
    public: {
      http: ["https://api.kon-wallet.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Konet Explorer",
      url: "https://konetexplorer.io",
    },
  },
  testnet: false,
});
