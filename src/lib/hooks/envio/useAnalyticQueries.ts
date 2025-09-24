import { STRINGS } from "@/data/constants";
import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import gqlRequest from "graphql-request";
import { useMemo } from "react";
import { Address, getAddress, zeroAddress } from "viem";
import { useChainId } from "wagmi";
import { deriveEnvioReadableId } from "./utils";

const QUERY_POOL_DAY_DATA = graphql(`
  query PoolDailyData($limit: Int = 1000, $pool: String!) {
    PoolDayData(
      limit: $limit
      where: { pool: { address: { _ilike: $pool } } }
    ) {
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeETH
      dailyVolumeUSD
      date
    }
  }
`);

const QUERY_TOKEN_DAY_DATA = graphql(`
  query TokenDailyData($limit: Int = 1000, $token: String!) {
    TokenDayData(
      limit: $limit
      where: { token: { address: { _ilike: $token } } }
    ) {
      date
      dailyVolumeToken
      dailyVolumeETH
      dailyVolumeUSD
      priceUSD
      priceETH
      totalLiquidityETH
      totalLiquidityUSD
    }
  }
`);

const QUERY_TOKEN_INFORMATION = graphql(`
  query TokenByPk($id: String!) {
    Token_by_pk(id: $id) {
      id
      address
      symbol
      name
      decimals
      tradeVolume
      tradeVolumeUSD
      txCount
      totalLiquidity
      totalLiquidityETH
      totalLiquidityUSD
      derivedETH
      derivedUSD
    }
  }
`);

function useQLGetPoolHourlyAnalytics(
  pool: Address,
  limit: number = 1000,
  refetchInterval: number | false = false
) {
  const queryKey = useMemo(() => ["__pool__hourly__data__:" + pool], [pool]);
  const { data, refetch, isFetching, error } = useQuery({
    queryKey,
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_POOL_DAY_DATA, {
        limit,
        pool,
      }),
    refetchInterval,
    enabled: pool !== zeroAddress,
  });
  return { data, refetch, isFetching, error };
}

function useQLGetTokenDailyAnalytics(
  token: Address,
  limit: number = 1000,
  refetchInterval: number | false = false
) {
  const queryKey = useMemo(() => ["__token__day__data__:" + token], [token]);
  const { data, refetch, isFetching, error } = useQuery({
    queryKey,
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_TOKEN_DAY_DATA, {
        limit,
        token,
      }),
    refetchInterval,
    enabled: token !== zeroAddress,
  });
  return { data, refetch, isFetching, error };
}

function useQLGetTokenInformation(
  id: string,
  refetchInterval: number | false = false
) {
  const chainId = useChainId();
  const tokenId = useMemo(() => {
    const members = id.split("-");
    if (members.length === 2 && members[1] === chainId.toString()) return id;
    // checksum first
    // eslint-disable-next-line react-hooks/exhaustive-deps
    id = getAddress(id);
    return deriveEnvioReadableId(id, chainId);
  }, [id, chainId]);
  const queryKey = useMemo(() => "__single__token__:" + tokenId, [tokenId]);

  const { data, refetch, isFetching, error } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_TOKEN_INFORMATION, { id: tokenId }),
    refetchInterval,
    enabled: !tokenId.startsWith(zeroAddress),
  });

  return { data, refetch, isFetching, error };
}

export default function useAnalyticQueries() {
  return {
    useQLGetPoolHourlyAnalytics,
    useQLGetTokenDailyAnalytics,
    useQLGetTokenInformation,
  };
}
