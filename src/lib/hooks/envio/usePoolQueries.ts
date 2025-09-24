import { STRINGS } from "@/data/constants";
import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import gqlRequest from "graphql-request";
import { useMemo } from "react";
import { getAddress, zeroAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { deriveEnvioReadableId } from "./utils";

const QUERY_POOLS = graphql(`
  query AllPools($limit: Int = 1000, $offset: Int = 0) {
    Pool(limit: $limit, offset: $offset) {
      id
      name
      address
      reserve0
      reserve1
      reserveUSD
      reserveETH
      tickSpacing
      gaugeFees0CurrentEpoch
      gaugeFees1CurrentEpoch
      gaugeFeesUSD
      totalFeesUSD
      totalBribesUSD
      totalEmissionsUSD
      poolType
      totalVotes
      totalSupply
      token0Price
      token1Price
      token0 {
        id
        address
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        totalLiquidityUSD
        symbol
        derivedUSD
      }
      token1 {
        id
        address
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        totalLiquidityUSD
        symbol
        derivedUSD
      }
      volumeUSD
      volumeETH
      gauge {
        id
        address
        fees0
        isAlive
        emission
        bribeVotingReward
        feeVotingReward
        rewardRate
        rewardToken {
          id
          address
          derivedUSD
          derivedETH
        }
      }
    }
  }
`);

const QUERY_POOL_BY_PK = graphql(`
  query SinglePool($id: String!) {
    Pool_by_pk(id: $id) {
      id
      name
      address
      reserve0
      reserve1
      reserveUSD
      reserveETH
      gaugeFees0CurrentEpoch
      gaugeFees1CurrentEpoch
      gaugeFeesUSD
      totalFeesUSD
      totalBribesUSD
      totalEmissionsUSD
      poolType
      totalSupply
      totalVotes
      token0Price
      token1Price
      token0 {
        id
        address
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        totalLiquidityUSD
        symbol
        derivedUSD
      }
      token1 {
        id
        address
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        totalLiquidityUSD
        symbol
        derivedUSD
      }
      volumeUSD
      volumeETH
      gauge {
        id
        address
        fees0
        isAlive
        emission
        bribeVotingReward
        feeVotingReward
        rewardRate
        rewardToken {
          id
          address
          derivedUSD
          derivedETH
        }
      }
    }
  }
`);

const QUERY_LP_POSITIONS = graphql(`
  query AllUserPositions($limit: Int = 1000, $user: String!) {
    LiquidityPosition(
      limit: $limit
      where: { account: { address: { _ilike: $user } } }
    ) {
      id
      position
      clPositionTokenId
      pool {
        id
        tickSpacing
        name
        address
        reserve0
        reserve1
        reserveUSD
        reserveETH
        gaugeFees0CurrentEpoch
        gaugeFees1CurrentEpoch
        gaugeFeesUSD
        totalFeesUSD
        totalEmissionsUSD
        poolType
        totalSupply
        totalVotes
        token0 {
          id
          address
          tradeVolume
          tradeVolumeUSD
          totalLiquidity
          totalLiquidityUSD
        }
        token1 {
          id
          address
          tradeVolume
          tradeVolumeUSD
          totalLiquidity
          totalLiquidityUSD
        }
        volumeUSD
        volumeETH
        gauge {
          id
          address
          fees0
          isAlive
          emission
          bribeVotingReward
          feeVotingReward
          rewardRate
          rewardToken {
            id
            address
            derivedUSD
            derivedETH
          }
        }
      }
    }
  }
`);

const QUERY_CLP_BY_RESERVE_IN_DESC_ORDER = graphql(`
  query PoolByReserveInDescendingOrder($limit: Int = 1000, $chainId: Int!) {
    Pool(
      limit: $limit
      order_by: { reserveUSD: desc }
      where: { poolType: { _eq: "CONCENTRATED" }, chainId: { _eq: $chainId } }
    ) {
      id
      name
      address
      reserve0
      reserve1
      reserveUSD
      reserveETH
      gaugeFees0CurrentEpoch
      gaugeFees1CurrentEpoch
      gaugeFeesUSD
      totalFeesUSD
      totalBribesUSD
      totalEmissionsUSD
      totalVotes
      poolType
      totalSupply
      tickSpacing
      token0 {
        id
        address
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        totalLiquidityUSD
      }
      token1 {
        id
        address
        tradeVolume
        tradeVolumeUSD
        totalLiquidity
        totalLiquidityUSD
      }
      volumeUSD
      volumeETH
      gauge {
        id
        address
        fees0
        isAlive
        emission
        rewardRate
        bribeVotingReward
        feeVotingReward
        rewardToken {
          id
          address
          derivedUSD
          derivedETH
        }
      }
    }
  }
`);

function useQLGetAllPools(
  limit: number = 1000,
  offset: number = 0,
  refetchInterval: number | false = false
) {
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["__pools__"],
    queryFn: async () =>
      gqlRequest({
        url: STRINGS.GQL_URL,
        document: QUERY_POOLS,
        variables: { limit, offset },
      }),
    refetchInterval,
  });

  return { data, refetch, isFetching, error };
}

function useQLGetSinglePool(
  id: string,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const poolId = useMemo(() => {
    const members = id.split("-");
    if (members.length === 2 && members[1] === chainId.toString()) return id;
    // checksum first
    // eslint-disable-next-line react-hooks/exhaustive-deps
    id = getAddress(id);
    return deriveEnvioReadableId(id, chainId);
  }, [id, chainId]);
  const queryKey = useMemo(() => "__single__pool__:" + poolId, [poolId]);

  const { data, refetch, isFetching, error } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_POOL_BY_PK, { id: poolId }),
    refetchInterval,
    enabled: !poolId.startsWith(zeroAddress),
  });

  return { data, refetch, isFetching, error };
}

function useQLGetAccountLPPositions(
  limit: number = 1000,
  refetchInterval: number | false = false
) {
  const { address = zeroAddress } = useAccount();
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["__account__lp__"],
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_LP_POSITIONS, { limit, user: address }),
    refetchInterval,
    enabled: address !== zeroAddress,
  });

  return { data, refetch, isFetching, error };
}

function useQLGetCLPByReserveDESC(
  limit: number = 1000,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["__clp__by__reserve__desc__"],
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_CLP_BY_RESERVE_IN_DESC_ORDER, {
        limit,
        chainId,
      }),
    refetchInterval,
    enabled: true,
  });

  return { data, refetch, isFetching, error };
}

export default function usePoolQueries() {
  return {
    useQLGetAllPools,
    useQLGetSinglePool,
    useQLGetAccountLPPositions,
    useQLGetCLPByReserveDESC,
  };
}
