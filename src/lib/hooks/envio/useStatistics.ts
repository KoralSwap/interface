import { graphql } from "@/gql";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { deriveEnvioReadableId } from "./utils";
import { useQuery } from "@tanstack/react-query";
import gqlRequest from "graphql-request";
import { STRINGS } from "@/data/constants";

const QUERY_STATISTICS = graphql(`
  query Stats($id: String!) {
    Statistics_by_pk(id: $id) {
      id
      totalBribesUSD
      totalFeesUSD
      totalPairsCreated
      totalTradeVolumeETH
      totalTradeVolumeUSD
      totalVolumeLockedETH
      totalVolumeLockedUSD
      txCount
    }
  }
`);

export default function useStatistics(refetchInterval: number | false = false) {
  const chainId = useChainId();
  const id = useMemo(() => deriveEnvioReadableId("1", chainId), [chainId]);
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["__statistics__"],
    queryFn: async () => gqlRequest(STRINGS.GQL_URL, QUERY_STATISTICS, { id }),
    refetchInterval,
  });
  return { data, refetch, isFetching, error };
}
