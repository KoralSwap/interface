import { TAddress } from "@/lib/types";

interface IToken {
  chainId?: number;
  address: TAddress;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}
export const tokens: IToken[] = [
  {
    name: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    symbol: "USDC",
    decimals: 12,
    chainId: 1,
    logoURI: "",
  },
  {
    name: "WETH",
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    symbol: "WETH",
    decimals: 18,
    chainId: 1,
    logoURI: "",
  },
  {
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  {
    name: "Usdt",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    symbol: "USDT",
    decimals: 6,
    chainId: 1,
    logoURI: "",
  },
  {
    name: "0x Protocol Token",
    address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    symbol: "ZRX",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png",
  },
  {
    name: "Wrapped BTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    decimals: 8,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
  {
    name: "Curve DAO Token",
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    symbol: "CRV",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
  },
  {
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    symbol: "UNI",
    decimals: 18,
    chainId: 1,
    logoURI: "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
  },
  {
    chainId: 1,
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg?1647476455",
  },
  {
    chainId: 1,
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    name: "1inch",
    symbol: "1INCH",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
  },
  {
    chainId: 1,
    address: "0x91Af0fBB28ABA7E31403Cb457106Ce79397FD4E6",
    name: "Aergo",
    symbol: "AERGO",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/4490/thumb/aergo.png?1647696770",
  },
  {
    chainId: 1,
    address: "0x626E8036dEB333b408Be468F951bdB42433cBF18",
    name: "AIOZ Network",
    symbol: "AIOZ",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/14631/thumb/aioz_logo.png?1617413126",
  },
  {
    chainId: 1,
    address: "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF",
    name: "Alchemix",
    symbol: "ALCX",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/14113/thumb/Alchemix.png?1614409874",
  },
  {
    chainId: 1,
    name: "SelfKey",
    symbol: "KEY",
    logoURI:
      "https://assets.coingecko.com/coins/images/2034/thumb/selfkey.png?1548608934",
    address: "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "League of Kingdoms",
    symbol: "LOKA",
    logoURI:
      "https://assets.coingecko.com/coins/images/22572/thumb/loka_64pix.png?1642643271",
    address: "0x61E90A50137E1F645c9eF4a0d3A4f01477738406",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Liquity USD",
    symbol: "LUSD",
    logoURI:
      "https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327",
    address: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "MATH",
    symbol: "MATH",
    logoURI:
      "https://assets.coingecko.com/coins/images/11335/thumb/2020-05-19-token-200.png?1589940590",
    address: "0x08d967bb0134F2d07f7cfb6E246680c53927DD30",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Metis",
    symbol: "METIS",
    logoURI:
      "https://assets.coingecko.com/coins/images/15595/thumb/metis.jpeg?1660285312",
    address: "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Monavale",
    symbol: "MONA",
    logoURI:
      "https://assets.coingecko.com/coins/images/13298/thumb/monavale_logo.jpg?1607232721",
    address: "0x275f5Ad03be0Fa221B4C6649B8AeE09a42D9412A",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Metal",
    symbol: "MTL",
    logoURI:
      "https://assets.coingecko.com/coins/images/763/thumb/Metal.png?1592195010",
    address: "0xF433089366899D83a9f26A773D59ec7eCF30355e",
    decimals: 8,
  },
  {
    chainId: 1,
    name: "Muse DAO",
    symbol: "MUSE",
    logoURI:
      "https://assets.coingecko.com/coins/images/13230/thumb/muse_logo.png?1606460453",
    address: "0xB6Ca7399B4F9CA56FC27cBfF44F4d2e4Eef1fc81",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "GensoKishi Metaverse",
    symbol: "MV",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/17704.png",
    address: "0xAE788F80F2756A86aa2F410C651F2aF83639B95b",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "MXC",
    symbol: "MXC",
    logoURI:
      "https://assets.coingecko.com/coins/images/4604/thumb/mxc.png?1655534336",
    address: "0x5Ca381bBfb58f0092df149bD3D243b08B9a8386e",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Marlin",
    symbol: "POND",
    logoURI:
      "https://assets.coingecko.com/coins/images/8903/thumb/POND_200x200.png?1622515451",
    address: "0x57B946008913B82E4dF85f501cbAeD910e58D26C",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "PARSIQ",
    symbol: "PRQ",
    logoURI:
      "https://assets.coingecko.com/coins/images/11973/thumb/DsNgK0O.png?1596590280",
    address: "0x362bc847A3a9637d3af6624EeC853618a43ed7D2",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "pSTAKE Finance",
    symbol: "PSTAKE",
    logoURI:
      "https://assets.coingecko.com/coins/images/23931/thumb/PSTAKE_Dark.png?1645709930",
    address: "0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Qredo",
    symbol: "QRDO",
    logoURI:
      "https://assets.coingecko.com/coins/images/17541/thumb/qrdo.png?1630637735",
    address: "0x4123a133ae3c521FD134D7b13A2dEC35b56c2463",
    decimals: 8,
  },
  {
    chainId: 1,
    name: "REVV",
    symbol: "REVV",
    logoURI:
      "https://assets.coingecko.com/coins/images/12373/thumb/REVV_TOKEN_Refined_2021_%281%29.png?1627652390",
    address: "0x557B933a7C2c45672B610F8954A3deB39a51A8Ca",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Rook",
    symbol: "ROOK",
    logoURI:
      "https://assets.coingecko.com/coins/images/13005/thumb/keeper_dao_logo.jpg?1604316506",
    address: "0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Stargate Finance",
    symbol: "STG",
    logoURI:
      "https://assets.coingecko.com/coins/images/24413/thumb/STG_LOGO.png?1647654518",
    address: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "SWFTCOIN",
    symbol: "SWFTC",
    logoURI:
      "https://assets.coingecko.com/coins/images/2346/thumb/SWFTCoin.jpg?1618392022",
    address: "0x0bb217E40F8a5Cb79Adf04E1aAb60E5abd0dfC1e",
    decimals: 8,
  },
  {
    chainId: 1,
    name: "Swipe",
    symbol: "SXP",
    logoURI:
      "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311",
    address: "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Sylo",
    symbol: "SYLO",
    logoURI:
      "https://assets.coingecko.com/coins/images/6430/thumb/SYLO.svg?1589527756",
    address: "0xf293d23BF2CDc05411Ca0edDD588eb1977e8dcd4",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Threshold Network",
    symbol: "T",
    logoURI:
      "https://assets.coingecko.com/coins/images/22228/thumb/nFPNiSbL_400x400.jpg?1641220340",
    address: "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "ChronoTech",
    symbol: "TIME",
    logoURI:
      "https://assets.coingecko.com/coins/images/604/thumb/time-32x32.png?1627130666",
    address: "0x485d17A6f1B8780392d53D64751824253011A260",
    decimals: 8,
  },
  {
    chainId: 1,
    name: "Alien Worlds",
    symbol: "TLM",
    logoURI:
      "https://assets.coingecko.com/coins/images/14676/thumb/kY-C4o7RThfWrDQsLCAG4q4clZhBDDfJQVhWUEKxXAzyQYMj4Jmq1zmFwpRqxhAJFPOa0AsW_PTSshoPuMnXNwq3rU7Imp15QimXTjlXMx0nC088mt1rIwRs75GnLLugWjSllxgzvQ9YrP4tBgclK4_rb17hjnusGj_c0u2fx0AvVokjSNB-v2poTj0xT9BZRCbzRE3-lF1.jpg?1617700061",
    address: "0x888888848B652B3E3a0f34c96E00EEC0F3a23F72",
    decimals: 4,
  },
  {
    chainId: 1,
    name: "TE FOOD",
    symbol: "TONE",
    logoURI:
      "https://assets.coingecko.com/coins/images/2325/thumb/tec.png?1547036538",
    address: "0x2Ab6Bb8408ca3199B8Fa6C92d5b455F820Af03c4",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "The Virtua Kolect",
    symbol: "TVK",
    logoURI:
      "https://assets.coingecko.com/coins/images/13330/thumb/virtua_original.png?1656043619",
    address: "0xd084B83C305daFD76AE3E1b4E1F1fe2eCcCb3988",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Wrapped Ampleforth",
    symbol: "WAMPL",
    logoURI:
      "https://assets.coingecko.com/coins/images/20825/thumb/photo_2021-11-25_02-05-11.jpg?1637811951",
    address: "0xEDB171C18cE90B633DB442f2A6F72874093b49Ef",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Wrapped Centrifuge",
    symbol: "WCFG",
    logoURI:
      "https://assets.coingecko.com/coins/images/17106/thumb/WCFG.jpg?1626266462",
    address: "0xc221b7E65FfC80DE234bbB6667aBDd46593D34F0",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "WOO Network",
    symbol: "WOO",
    logoURI:
      "https://assets.coingecko.com/coins/images/12921/thumb/w2UiemF__400x400.jpg?1603670367",
    address: "0x4691937a7508860F876c9c0a2a617E7d9E945D4B",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Chain",
    symbol: "XCN",
    logoURI:
      "https://assets.coingecko.com/coins/images/24210/thumb/Chain_icon_200x200.png?1646895054",
    address: "0xA2cd3D43c775978A96BdBf12d733D5A1ED94fb18",
    decimals: 18,
  },
  {
    chainId: 1,
    name: "Yield Guild Games",
    symbol: "YGG",
    logoURI:
      "https://assets.coingecko.com/coins/images/17358/thumb/le1nzlO6_400x400.jpg?1632465691",
    address: "0x25f8087EAD173b73D6e8B84329989A8eEA16CF73",
    decimals: 18,
  },
  {
    chainId: 1,
    address: "0x23B608675a2B2fB1890d3ABBd85c5775c51691d5",
    name: "Unisocks",
    symbol: "SOCKS",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/10717/thumb/qFrcoiM.png?1582525244",
  },
  {
    chainId: 1,
    address: "0x5283D291DBCF85356A21bA090E6db59121208b44",
    name: "Blur",
    symbol: "BLUR",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/28453/large/blur.png?1670745921",
  },
];
