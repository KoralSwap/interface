export const ASSET_REPO =
  "https://raw.githubusercontent.com/SIR-trading/assets/master";
export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const TWO_YEARS = 62208000;
export const DAYS_14 = 60 * 60 * 24 * 14;
export const QUOTE_REFETCH_INTERVAL = 1000 * 30;
export const RCT_DECIMALS = 18;
export const HUNDRED_PERCENT_BN = 10000n;

export enum ChainId {
  MONAD_TESTNET = 10143,
}
export const PAIR_FACTORY: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0x22595aA7f5298b49D62450DA6300882Fb3d98eBc",
};
export const VOTER: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xc31d18ba3a85CAe6031549fC59E522Cfc59Ba7e0",
};
export const V2_FACTORY: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0x6dFdF83AFfD62E4BF55dB0BF4bd816e3ccaCb963",
};
export const CL_FACTORY: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xebd565DbDeaFff470aeE844bD0F84210c5D26c9E",
};
export const V2_ROUTER: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0x30a2b77Bf611Fc0428fe35123855CeDf0cfC6474",
};
export const CL_SWAP_ROUTER: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xDFb2e3aBE9A81241e133B42334c3Ce785A87902C",
};
export const CL_SWAP_FEE_RECIPIENT: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xb69DB7b7B3aD64d53126DCD1f4D5fBDaea4fF578",
};
export const NFT_POSITION_MANAGER: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0x2a4440dF3351Bac4e7cb8b1D12E07f004aBc3372",
};
export const CL_QUOTER: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xB3C58E55d6F57A8fc5F36052238a0C8714b2C9f2",
};
export const WETH: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
};
export const ORACLE: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0x5caa9d7fac6ef9ff9f50b95008ffb9f6299e8bcd",
};
export const VE: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xc645D50D0868a68a75c8cA81dCA6A6c2361309B3",
};
export const RCT: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xc503424cE6D9A1D452D620CdD0c3C419D5fcB735",
};
export const DISTRIBUTOR: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xFD9795E64B0C2220895273716f7A6cc59F571618",
};
export const VAS: { [key: number]: `0x${string}` } = {
  [ChainId.MONAD_TESTNET]: "0xe0C2aC5716da69382a3ba3C20E43b91Ada068Fb6",
};
export const ETHER = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
// Explorer links
export const EXPLORERS: { [key: number]: string } = {
  [ChainId.MONAD_TESTNET]: "https://testnet.monadexplorer.com",
};

export const STRINGS = {
  GQL_URL: "https://indexer.hyperindex.xyz/dd85139/v1/graphql",
  INSUFFICIENT_BALANCE: "Insufficient Balance",
  UNSELECTED_TOKENS: "Please Select Assets",
  SWAP_PATH_NOT_FOUND: "No Available Routes",
};

export const PRESETS = {
  NARROW: {
    min: 4.88,
    max: 4.7,
  },
  COMMON: {
    min: 9.88,
    max: 9.85,
  },
  WIDE: {
    min: 20.07,
    max: 20.19,
  },
  FULL: {
    min: 0,
    max: 100,
  },
};

export const TICK_SPACINGS = {
  ONE: 1,
  FIFTY: 50,
  HUNDRED: 100,
  TWO_HUNDRED: 200,
};

export const TICKS = {
  MIN: -16000,
  MAX: 16000,
};

export const TIME = { WEEK: 604800 };
