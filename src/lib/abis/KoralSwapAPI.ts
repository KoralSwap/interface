export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getAllPoolsData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            internalType: "string",
            name: "token0Symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "token1Symbol",
            type: "string",
          },
          {
            internalType: "bool",
            name: "stable",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "gauge",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "gaugeWeight",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gaugeRewardRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gaugeTotalStaked",
            type: "uint256",
          },
        ],
        internalType: "struct KoralSwapAPI.PoolData[]",
        name: "pools",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "getPoolData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            internalType: "string",
            name: "token0Symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "token1Symbol",
            type: "string",
          },
          {
            internalType: "bool",
            name: "stable",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "reserve0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reserve1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "gauge",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "gaugeWeight",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gaugeRewardRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gaugeTotalStaked",
            type: "uint256",
          },
        ],
        internalType: "struct KoralSwapAPI.PoolData",
        name: "data",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getUserPoolData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "liquidity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "token0Amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "token1Amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakedInGauge",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gaugeEarned",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimable0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimable1",
            type: "uint256",
          },
        ],
        internalType: "struct KoralSwapAPI.UserPoolData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_targetToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
    ],
    name: "getPoolTVL",
    outputs: [
      {
        internalType: "uint256",
        name: "poolTVL",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_pools",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getUserPositions",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "liquidity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "token0Amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "token1Amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakedInGauge",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gaugeEarned",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimable0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimable1",
            type: "uint256",
          },
        ],
        internalType: "struct KoralSwapAPI.UserPoolData[]",
        name: "positions",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ve",
        type: "address",
      },
      {
        internalType: "address",
        name: "_minter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_targetToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
    ],
    name: "getProtocolInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "voter",
            type: "address",
          },
          {
            internalType: "address",
            name: "ve",
            type: "address",
          },
          {
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            internalType: "address",
            name: "factoryRegistry",
            type: "address",
          },
          {
            internalType: "address",
            name: "koral",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "totalVotingPower",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalWeight",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "koralCirculating",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "weeklyEmission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tvl",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalFees",
            type: "uint256",
          },
        ],
        internalType: "struct KoralSwapAPI.ProtocolInfo",
        name: "info",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
