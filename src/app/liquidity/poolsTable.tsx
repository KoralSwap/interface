"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import PoolRow from "./poolRow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchInput from "@/components/shared/searchInput";
import { useDebounce } from "@/lib/hooks/useDebounce";
import PoolRowSkeleton from "./poolRowSkeleton";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import { Pool } from "@/gql/graphql";

type QueryFilters = {
  searchQuery: string;
  stability: undefined | "stable" | "volatile" | "concentrated";
  orderBy: "none" | "tvl" | "fees" | "volume";
  orderDirection: "up" | "down";
};

enum TabValues {
  ALL = "all",
  STABLE = "stable",
  VOLATILE = "volatile",
  CONCENTRATED = "concentrated",
}

const pageLength = 10;

export default function PoolsTable() {
  const [loadingBounced, setLoadingBounced] = useState(false);
  const { useQLGetAllPools } = usePoolQueries();
  const { data: QLAP, isFetching: poolsLoading } = useQLGetAllPools(
    1000,
    0,
    60000
  );
  const prunedData = useMemo(
    () =>
      QLAP?.Pool ? QLAP.Pool.filter((p) => Number(p.totalSupply) >= 0) : [],
    [QLAP]
  );
  const [filters, setFilters] = useState<QueryFilters>({
    searchQuery: "",
    stability: undefined,
    orderBy: "none",
    orderDirection: "up",
  });
  const [page, setPage] = useState(1);
  const updateState = useCallback(
    (value: Partial<QueryFilters>) => {
      setFilters({ ...filters, ...value });
    },
    [filters]
  );
  const { debouncedValue: filtersDebounced } = useDebounce(filters, 300);
  const { modifiedPools, poolsLength } = useMemo(() => {
    const { searchQuery, stability, orderBy, orderDirection } =
      filtersDebounced;
    // First filter by search query
    let filteredPools = searchQuery.trim().length
      ? prunedData.filter(
          (pool) =>
            pool.token0?.address
              .toLowerCase()
              .startsWith(searchQuery.toLowerCase()) ||
            pool.token1?.address
              .toLowerCase()
              .startsWith(searchQuery.toLowerCase()) ||
            pool.address.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            pool.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      : prunedData;
    // Filter now by stability
    if (stability === "stable")
      filteredPools = filteredPools.filter(
        (pool) => pool.poolType === "STABLE"
      );
    if (stability === "volatile")
      filteredPools = filteredPools.filter(
        (pool) => pool.poolType === "VOLATILE"
      );
    if (stability === "concentrated")
      filteredPools = filteredPools.filter(
        (pool) => pool.poolType === "CONCENTRATED"
      );
    // Sort by TVL
    switch (orderBy) {
      case "none":
        break;
      case "tvl":
        filteredPools = filteredPools.toSorted((a, b) =>
          Number(b.reserveUSD - a.reserveUSD)
        );
        break;
      case "fees":
        filteredPools = filteredPools.toSorted((a, b) =>
          Number(b.totalFeesUSD - a.totalFeesUSD)
        );
        break;
      case "volume":
        filteredPools = filteredPools.toSorted((a, b) =>
          Number(b.volumeUSD - a.volumeUSD)
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
        case TabValues.CONCENTRATED: {
          updateState({ stability: "concentrated" });
          break;
        }
      }
    },
    [updateState]
  );

  return (
    <>
      <div className="flex justify-between pt-4 items-center">
        <Tabs
          defaultValue="all"
          onValueChange={(val) => handleTabChange(val as TabValues)}
        >
          <TabsList>
            <TabsTrigger value={TabValues.ALL}>All</TabsTrigger>
            <TabsTrigger value={TabValues.STABLE}>Stable</TabsTrigger>
            <TabsTrigger value={TabValues.VOLATILE}>Volatile</TabsTrigger>
            <TabsTrigger value={TabValues.CONCENTRATED}>
              Concentrated
            </TabsTrigger>
            {/* <TabsTrigger value={TabValues.CONCENTRATED}> */}
            {/*   Concentrated */}
            {/* </TabsTrigger> */}
          </TabsList>
        </Tabs>
        <div className="hidden md:block">
          <SearchInput
            className="bg-neutral-950   w-[340px]"
            value={filters.searchQuery}
            setValue={(value) => {
              updateState({ searchQuery: value });
            }}
          />
        </div>
      </div>
      <div className="pt-4 min-h-[500px]  overflow-x-auto scroll-container">
        <table className="w-full min-w-[500px]">
          <thead className="text-neutral-400 text-sm text-right w-full">
            <tr className=" grid grid-cols-6 lg:grid-cols-11 items-center gap-x-4 px-4">
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
              <th className=" justify-end hidden lg:flex">
                <OrderButton
                  title="Fees"
                  orderBy={"fees"}
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
              <th className="flex justify-end">
                <OrderButton
                  title="Volume"
                  orderBy={"volume"}
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
              <th className="text-left hidden lg:block col-span-3 pl-4">
                Liquidity Manager
              </th>
            </tr>
          </thead>
          <tbody className="gap-y-2 pt-2 flex flex-col">
            {loadingBounced &&
              Array.from({ length: pageLength }, (_, i) => (
                <PoolRowSkeleton key={i} />
              ))}
            {!loadingBounced &&
              modifiedPools.map((pool) => (
                <PoolRow data={pool as Pool} key={pool.id} />
              ))}
          </tbody>
        </table>
      </div>

      <div className="py-2  flex justify-between">
        <p className="text-[13px]">
          Page {page}{" "}
          <span className="text-neutral-300">({poolsLength} results)</span>
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

function OrderButton({
  onClick,
  direction,
  title,
  orderBy,
  value,
}: {
  title: string;
  onClick: (
    direction: "up" | "down",
    orderBy: "tvl" | "fees" | "volume"
  ) => void;
  direction: "up" | "down";
  orderBy: "tvl" | "fees" | "volume";
  value: "tvl" | "fees" | "volume" | "none";
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
