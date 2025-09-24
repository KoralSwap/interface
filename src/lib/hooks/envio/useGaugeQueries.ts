import { STRINGS } from "@/data/constants";
import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import gqlRequest from "graphql-request";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

const QUERY_GAUGE_POSITIONS = graphql(`
  query AllUserGaugePositions($limit: Int = 1000, $user: String!) {
    GaugePosition(
      limit: $limit
      where: { account: { address: { _ilike: $user } } }
    ) {
      amountDeposited
      id
      gauge {
        id
        address
        fees0
        fees1
        totalSupply
        isAlive
        emission
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

function useQLGetAllGaugePositions(
  limit: number = 1000,
  refetchInterval: number | false = false
) {
  const { address = zeroAddress } = useAccount();
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["__gauge__positions__"],
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_GAUGE_POSITIONS, {
        limit,
        user: address,
      }),
    refetchInterval,
    enabled: address !== zeroAddress,
  });
  return { data, refetch, isFetching, error };
}

export default function useGaugeQueries() {
  return { useQLGetAllGaugePositions };
}
