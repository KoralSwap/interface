import { STRINGS } from "@/data/constants";
import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import gqlRequest from "graphql-request";
import { zeroAddress } from "viem";
import { useAccount, useChainId } from "wagmi";

const QUERY_ACCOUNT_LOCKS = graphql(`
  query LockPositions(
    $limit: Int = 1000
    $offset: Int = 0
    $user: String!
    $chainId: Int!
  ) {
    LockPosition(
      limit: $limit
      offset: $offset
      where: {
        owner: { address: { _ilike: $user } }
        chainId: { _eq: $chainId }
      }
    ) {
      id
      position
      lockId
      lockType
      unlockTime
      totalVoteWeightGiven
    }
  }
`);

function useQLGetAccountLockPositions(
  limit: number = 1000,
  refetchInterval: number | false = false
) {
  const { address = zeroAddress } = useAccount();
  const chainId = useChainId();
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["__account__lock__position"],
    queryFn: async () =>
      gqlRequest(STRINGS.GQL_URL, QUERY_ACCOUNT_LOCKS, {
        limit,
        user: address,
        chainId,
      }),
    refetchInterval,
    enabled: address !== zeroAddress,
  });

  return { data, refetch, isFetching, error };
}

export default function useLockQueries() {
  return { useQLGetAccountLockPositions };
}
