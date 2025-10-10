"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchInput from "@/components/shared/searchInput";
import { useDebounce } from "@/lib/hooks/useDebounce";
import PoolRowSkeleton from "./poolRowSkeleton";
import useKoralSwapAPI from "@/lib/hooks/useKoralSwapAPI";
import { formatUnits } from "viem";
import PoolRowNative from "./poolRowNative";

type QueryFilters = {
  searchQuery: string;
  stability: undefined | "stable" | "volatile";
  orderBy: "none" | "tvl" | "volume";
  orderDirection: "up" | "down";
};

enum TabValues {
  ALL = "all",
  STABLE = "stable",
  VOLATILE = "volatile",
}

const pageLength = 10;

export default function PoolsTable() {
  const [loadingBounced, setLoadingBounced] = useState(false);
  const { useGetAllPoolsData } = useKoralSwapAPI();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<QueryFilters>({
    searchQuery: "",
    stability: undefined,
    orderBy: "none",
    orderDirection: "up",
  });

  const { debouncedValue: filtersDebounced } = useDebounce(filters, 300);

  const { pools: rawPools, isFetching: poolsLoading } = useGetAllPoolsData(
    100, // limit - Fetch more to allow client-side filtering
    0, // offset
    60000
  );

  const prunedData = useMemo(
    () => rawPools.filter((p) => Number(p.totalSupply) > 0),
    [rawPools]
  );

  const updateState = useCallback(
    (value: Partial<QueryFilters>) => {
      setFilters({ ...filters, ...value });
    },
    [filters]
  );

  const { modifiedPools, poolsLength } = useMemo(() => {
    const { searchQuery, stability, orderBy, orderDirection } =
      filtersDebounced;

    // First filter by search query
    let filteredPools = searchQuery.trim().length
      ? prunedData.filter(
          (pool) =>
            pool.token0.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            pool.token1.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            pool.pool.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            pool.token0Symbol
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            pool.token1Symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : prunedData;

    // Filter by stability
    if (stability === "stable")
      filteredPools = filteredPools.filter((pool) => pool.stable);
    if (stability === "volatile")
      filteredPools = filteredPools.filter((pool) => !pool.stable);

    // Sort pools
    switch (orderBy) {
      case "none":
        break;
      case "tvl":
        filteredPools = filteredPools.toSorted((a, b) => {
          const aReserve = Number(formatUnits(a.reserve0 + a.reserve1, 18));
          const bReserve = Number(formatUnits(b.reserve0 + b.reserve1, 18));
          return bReserve - aReserve;
        });
        break;
      case "volume":
        // Sort by total supply as a proxy for volume
        filteredPools = filteredPools.toSorted((a, b) =>
          Number(b.totalSupply - a.totalSupply)
        );
        break;
    }

    switch (orderDirection) {
      case "up":
        filteredPools = filteredPools.reverse();
        break;
      case "down":
        break;
    }

    const start = (page - 1) * pageLength;
    const end = page * pageLength;
    const modifiedPools = filteredPools.slice(start, end);
    return { modifiedPools, poolsLength: filteredPools.length };
  }, [filtersDebounced, page, prunedData]);

  const lastPage = useMemo(
    () => Math.ceil(poolsLength / pageLength),
    [poolsLength]
  );

  useEffect(() => {
    if (poolsLoading) {
      setLoadingBounced(true);
    } else {
      const timer = setTimeout(() => {
        setLoadingBounced(false);
      }, 400);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [poolsLoading]);

  const handleTabChange = useCallback(
    (value: TabValues) => {
      setPage(1);
      switch (value) {
        case TabValues.ALL: {
          updateState({ stability: undefined });
          break;
        }
        case TabValues.STABLE: {
          updateState({ stability: "stable" });
          break;
        }
        case TabValues.VOLATILE: {
          updateState({ stability: "volatile" });
          break;
        }
      }
    },
    [updateState]
  );

  return (
    <>
      <div className="flex justify-between pt-6 pb-4 items-center">
        <Tabs
          defaultValue="all"
          onValueChange={(val) => handleTabChange(val as TabValues)}
        >
          <TabsList>
            <TabsTrigger value={TabValues.ALL}>All</TabsTrigger>
            <TabsTrigger value={TabValues.STABLE}>Stable</TabsTrigger>
            <TabsTrigger value={TabValues.VOLATILE}>Volatile</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="hidden md:block">
          <SearchInput
            className="bg-neutral-1000 w-[340px]"
            value={filters.searchQuery}
            setValue={(value) => {
              updateState({ searchQuery: value });
            }}
          />
        </div>
      </div>
      <div className="pt-2 min-h-[500px] overflow-x-auto scroll-container">
        <table className="w-full min-w-[500px]">
          <thead className="text-neutral-400 text-xs font-semibold uppercase tracking-wider text-right w-full">
            <tr className="grid grid-cols-6 lg:grid-cols-11 items-center gap-x-4 px-6 pb-3 border-b border-neutral-900">
              <th className=" col-span-3 lg:col-span-4 text-left flex gap-x-4">
                <span>Pool Name</span>
              </th>
              <th className="flex justify-end ">
                <OrderButton
                  title="TVL"
                  orderBy={"tvl"}
                  direction={filters.orderDirection}
                  value={filters.orderBy}
                  onClick={(a, b) =>
                    updateState({
                      orderDirection: a,
                      orderBy: b,
                    })
                  }
                />
              </th>
              <th className="hidden lg:block">APR</th>
              <th className="justify-end hidden lg:flex">
                <span>Reserve 0</span>
              </th>
              <th className="justify-end hidden lg:flex">
                <span>Reserve 1</span>
              </th>
              <th className="text-left hidden lg:block col-span-3 pl-4"></th>
            </tr>
          </thead>
          <tbody className="gap-y-2 pt-2 flex flex-col">
            {loadingBounced &&
              Array.from({ length: pageLength }, (_, i) => (
                <PoolRowSkeleton key={i} />
              ))}
            {!loadingBounced &&
              modifiedPools.map((pool) => (
                <PoolRowNative data={pool} key={pool.pool} />
              ))}
          </tbody>
        </table>
      </div>

      <div className="py-4 flex justify-between items-center border-t border-neutral-900 mt-4">
        <p className="text-sm text-neutral-400">
          Page <span className="text-white font-medium">{page}</span> of{" "}
          <span className="text-white font-medium">{lastPage}</span>
          <span className="text-neutral-500 ml-2">({poolsLength} pools)</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous Page of Pools"
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-900 bg-neutral-1000 text-white transition-all hover:border-blue-500/50 hover:bg-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-900"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next Page of Pools"
            disabled={page === lastPage}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-900 bg-neutral-1000 text-white transition-all hover:border-blue-500/50 hover:bg-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-900"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

function OrderButton({
  onClick,
  direction,
  title,
  orderBy,
  value,
}: {
  title: string;
  onClick: (direction: "up" | "down", orderBy: "tvl" | "volume") => void;
  direction: "up" | "down";
  orderBy: "tvl" | "volume";
  value: "tvl" | "volume" | "none";
}) {
  const handleClick = () => {
    if (orderBy !== value) {
      onClick("up", orderBy);
      return;
    }
    onClick(direction === "up" ? "down" : "up", orderBy);
  };
  const selected = orderBy === value;
  return (
    <button className=" flex gap-x-1 items-center" onClick={handleClick}>
      <span className="hover:text-white">{title}</span>
      <div className="hidden lg:block">
        <ChevronUp
          data-direction={selected ? direction : "none"}
          className="text-neutral-400 data-[direction=none]:text-neutral-400 -mb-1 data-[direction=down]:text-white"
          size={16}
          strokeWidth={3}
        />
        <ChevronDown
          data-direction={selected ? direction : "none"}
          strokeWidth={3}
          className="text-neutral-400 -mt-1 data-[direction=none]:text-neutral-400 data-[direction=up]:text-white"
          size={16}
        />
      </div>
    </button>
  );
}
