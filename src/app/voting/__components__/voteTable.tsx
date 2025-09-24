import React, { useMemo, useState } from "react";
import VoteRow from "./voteRow";
import { TableBody } from "@/components/ui/table";
import { Address } from "viem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VoteRowSkeleton from "./voteRowSkeleton";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import { Pool } from "@/gql/graphql";
import { Allocations } from "../types";

const pageLength = 10;

export default function VoteTable({
  searchQuery = "",
  selectedLockId,
  allocations,
  allocate,
}: {
  searchQuery?: string;
  selectedLockId?: bigint;
  allocations: Allocations;
  allocate: (poolAddress: Address, percentage: number) => void;
}) {
  const { useQLGetAllPools } = usePoolQueries();
  const { data: QLAllPools, isFetching: isLoading } = useQLGetAllPools(
    1000,
    0,
    60000
  );
  const prunedData = useMemo(() => {
    if (!QLAllPools) return [];
    return QLAllPools.Pool.filter(
      (pool) => pool.gauge !== null && typeof pool.gauge !== "undefined"
    );
  }, [QLAllPools]);
  const lastPage = useMemo(
    () => Math.ceil(prunedData.length / pageLength),
    [prunedData]
  );
  const [page, setPage] = useState(1);
  const slicedPools = useMemo(() => {
    const start = (page - 1) * pageLength;
    const end = page * pageLength;
    return prunedData
      .filter(
        (p) =>
          p.address.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
      .slice(start, end);
  }, [prunedData, page, searchQuery]);
  return (
    <>
      <div className="pt-4 min-h-[500px]  overflow-x-auto scroll-container">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="grid grid-cols-8 lg:grid-cols-10 gap-x-4 px-4 text-neutral-500 text-sm font-normal text-right">
              <th className="lg:col-span-3 col-span-2 text-left">Pool</th>
              <th className="text-right">TVL</th>
              <th>APR</th>
              <th>Total Rewards</th>
              <th>Incentives</th>
              <th>Total Votes</th>
              {/* <th>Pool Name</th>
          <th className="text-right">Pool Name</th> */}
            </tr>
          </thead>
          <TableBody>
            {isLoading &&
              Array.from({ length: pageLength }, (_, i) => (
                <VoteRowSkeleton key={i} />
              ))}
            {!isLoading &&
              slicedPools.map((pool) => (
                <VoteRow
                  key={pool.id}
                  pool={pool as Pool}
                  selectedLockId={selectedLockId}
                  allocations={allocations}
                  allocate={allocate}
                />
              ))}
          </TableBody>
        </table>
      </div>

      <div className="py-2  flex justify-between">
        <p className="text-[13px]">
          Page {page}{" "}
          <span className="text-neutral-300">
            ({prunedData.length} results)
          </span>
        </p>
        <div className="flex">
          <button
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous Page of Pools"
            disabled={page === 1}
            className="disabled:opacity-50"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next Page of Pools"
            disabled={page === lastPage}
            className="disabled:opacity-50"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
