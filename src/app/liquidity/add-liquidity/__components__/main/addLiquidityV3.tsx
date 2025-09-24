import {
  useV3IncreaseLiquidity,
  useV3InitializeLiquidity,
} from "@/app/liquidity/__hooks__/useAddLiquidity";
import { useV3QuoteAddLiquidity } from "@/app/liquidity/__hooks__/useQuoteLiquidity";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import {
  ETHER,
  NFT_POSITION_MANAGER,
  PRESETS,
  STRINGS,
  TICK_SPACINGS,
  TICKS,
  TIME,
} from "@/data/constants";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import { useV3CheckPair } from "@/lib/hooks/useCheckPair";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import useGetToken from "@/lib/hooks/useGetToken";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import { formatNumber } from "@/lib/utils";
import {
  calculateEpochStartNow,
  convertETHToWETHIfApplicable,
  convertWETHToPlainETHIfApplicable,
  nearestUsableTick,
  priceToTick,
  useGetTokenInfo,
} from "@/utils";
import { Check, Minus, Plus, RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatEther,
  formatUnits,
  isAddress,
  maxUint256,
  parseUnits,
  zeroAddress,
} from "viem";
import { useChainId } from "wagmi";
import { TToken } from "@/lib/types";
import ImageWithFallback from "@/components/shared/imageWithFallback";
import { useV3CheckPoolSlot0 } from "@/lib/hooks/pools/usePoolCalls";
import RangeVisualizationChart from "@/components/ui/charts/RangeVisualizationChart";
import { z } from "zod";
import useAnalyticQueries from "@/lib/hooks/envio/useAnalyticQueries";
import useVoterCalls from "@/lib/hooks/voter/useVoterCalls";
import useGaugeCalls from "@/lib/hooks/gauges/useGaugeCalls";
import { GaugeType } from "@/lib/hooks/gauges/shared";
import { ChartNoAxesCombined } from "lucide-react";
import { useAtomicDate } from "@/lib/hooks/useAtomicDate";
import { useWindowDimensions } from "@/lib/hooks/useWindowDimensions";

const BASIS_POINT = 1.0001;

// const chartConfig: ChartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
// };

// interface ChartProps {
//   data: { x: number; y: number }[];
//   minPrice: number;
//   maxPrice: number;
//   currentPrice?: number;
//   onMinPriceChange?: (newMinPrice: number) => void;
//   onMaxPriceChange?: (newMaxPrice: number) => void;
// }

const SearchParamsSchema = z.object({
  token0: z.string().refine((arg) => isAddress(arg)),
  token1: z.string().refine((arg) => isAddress(arg)),
  version: z.enum(["stable", "concentrated", "volatile"]).optional(),
  tokenId: z.coerce.bigint().optional().nullable(),
  tickSpacing: z.coerce.bigint().optional().nullable(),
});

// function RangeChart({
//   data,
//   minPrice,
//   maxPrice,
//   currentPrice = 0,
//   onMaxPriceChange,
//   onMinPriceChange,
// }: ChartProps) {
//   const handleMinPriceMovement = useCallback(
//     (_: DraggableEvent, data: DraggableData) => {
//       console.log(data);
//       if (onMinPriceChange) onMinPriceChange(data.x);
//       if (data.x > maxPrice && onMaxPriceChange)
//         onMaxPriceChange(data.x + data.deltaX / 100);
//     },
//     [maxPrice, onMaxPriceChange, onMinPriceChange]
//   );

//   const handleMaxPriceMovement = useCallback(
//     (_: DraggableEvent, data: DraggableData) => {
//       if (onMaxPriceChange) onMaxPriceChange(data.x);
//       if (data.x < minPrice && onMinPriceChange)
//         onMinPriceChange(data.x - data.deltaX / 100);
//     },
//     [minPrice, onMaxPriceChange, onMinPriceChange]
//   );

//   const handleChartClick = useCallback(
//     (e: CategoricalChartState) => {
//       const rangeDelta = Math.abs(maxPrice - minPrice);
//       if (e && e.activeCoordinate) {
//         const minPriceDelta = Math.abs(e.activeCoordinate.x - minPrice);
//         if (onMinPriceChange) onMinPriceChange(minPriceDelta);
//         if (minPriceDelta > maxPrice && onMaxPriceChange)
//           onMaxPriceChange(minPriceDelta + rangeDelta);
//       }
//     },
//     [maxPrice, minPrice, onMaxPriceChange, onMinPriceChange]
//   );

//   const draggableRef0 = useRef(null);
//   const draggableRef1 = useRef(null);
//   return (
//     <ChartContainer className="w-full" config={chartConfig}>
//       <LineChart
//         data={data}
//         height={900}
//         className="bg-[#272734]"
//         width={500}
//         margin={{ top: 10, right: 30, bottom: 0, left: 0 }}
//         onClick={handleChartClick}
//       >
//         <XAxis
//           stroke="#8062f1"
//           tickFormatter={(value) => formatNumber(value, 3)}
//           minTickGap={12}
//           allowDecimals
//         />
//         <YAxis dataKey="y" />
//         <Draggable
//           axis="x"
//           bounds="parent"
//           onStop={handleMinPriceMovement}
//           onDrag={handleMinPriceMovement}
//           handle=".draggable"
//           nodeRef={draggableRef0}
//           defaultPosition={{ x: 0, y: 0 }}
//           position={undefined}
//           grid={[5, 5]}
//           scale={1}
//         >
//           <div
//             ref={draggableRef0}
//             className="w-[100px] flex justify-start items-start gap-0"
//           >
//             <ReferenceLine
//               x={Math.round(minPrice)}
//               stroke="#8062f1"
//               strokeWidth={7}
//               className="draggable"
//             />
//           </div>
//         </Draggable>
//         <ReferenceLine x={Math.round(currentPrice)} stroke="#fff" />
//         <Draggable
//           axis="x"
//           bounds="parent"
//           onDrag={handleMaxPriceMovement}
//           handle=".draggable2"
//           nodeRef={draggableRef1}
//           defaultPosition={{ x: 0, y: 0 }}
//           position={undefined}
//           grid={[5, 5]}
//           scale={1}
//         >
//           <div ref={draggableRef1}>
//             <ReferenceLine
//               x={Math.round(maxPrice)}
//               stroke="#8062f1"
//               strokeWidth={5}
//               className="draggable2"
//             />
//           </div>
//         </Draggable>
//         <ReferenceArea
//           x1={Math.round(minPrice)}
//           x2={Math.round(maxPrice)}
//           stroke="#8062f1"
//           fill="#aea4fb"
//         />
//         <Line
//           connectNulls
//           dataKey="x"
//           type="monotone"
//           fill="#8062f1"
//           stroke="#272734"
//           strokeWidth={2}
//         />
//         {/* <Area dataKey="y" stackId={1} type="monotoneY" fill="#8062f1" stroke="#272734" /> */}
//       </LineChart>
//     </ChartContainer>
//   );
// }

export default function AddLiquidityV3() {
  const [tickSpacing, setTickSpacing] = useState(TICK_SPACINGS.FIFTY);
  const [preset, setPreset] = useState<keyof typeof PRESETS>("NARROW");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("0");
  const [amount0, setAmount0] = useState("0");
  const [amount1, setAmount1] = useState("0");

  const { debouncedValue: amount0Bounced } = useDebounce(amount0, 300);
  const { debouncedValue: amount1Bounced } = useDebounce(amount1, 300);

  // const price = useMemo(() => {
  //   const x96 = Number(sqrtPriceX96Min) / 2 ** 96;
  //   return x96 ** 2;
  // }, [sqrtPriceX96Min]);

  // const possibleMinPrice = useMemo(() => ticksAndPrices[0].x, [ticksAndPrices]);

  // Wagmi parameters
  const chainId = useChainId();
  const [selectedInput, setSelectedInput] = useState<"0" | "1">("0");
  const [baseToken, setBaseToken] = useState<0 | 1>(0);
  // Token list
  // Search params
  const params = useSearchParams();
  const { t0, t1, positionId, spacing } = useMemo(() => {
    const t0 = params.get("token0");
    const t1 = params.get("token1");
    const positionId = params.get("positionId");
    const spacing = params.get("tickSpacing");
    const param = {
      token0: t0,
      token1: t1,
      tokenId: positionId,
      tickSpacing: spacing,
    };

    const afterParse = SearchParamsSchema.safeParse(param);
    if (!afterParse.success) {
      return { t0: undefined, t1: undefined, positionId: 0n, spacing: null };
    }
    const { token1, token0, tokenId, tickSpacing: tSpacing } = afterParse.data;
    return { t1: token1, t0: token0, positionId: tokenId, spacing: tSpacing };
  }, [params]);

  const { setToast } = useTransactionToastProvider();
  const positionManager = useMemo(
    () => NFT_POSITION_MANAGER[chainId],
    [chainId]
  );
  const token0 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(t0 ?? zeroAddress, chainId)
  );
  const token1 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(t1 ?? zeroAddress, chainId)
  );
  const { isFetched: fetched0, token: fetchedToken0 } = useGetToken({
    address: t0,
    disabled: !!token0,
  });
  const { isFetched: fetched1, token: fetchedToken1 } = useGetToken({
    address: t1,
    disabled: !!token1,
  });

  const asset0 = useMemo(
    () =>
      !!token0
        ? token0
        : fetched0 && !!fetchedToken0
          ? fetchedToken0
          : undefined,
    [fetched0, fetchedToken0, token0]
  );
  const asset1 = useMemo(
    () =>
      !!token1
        ? token1
        : fetched1 && !!fetchedToken1
          ? fetchedToken1
          : undefined,
    [fetched1, fetchedToken1, token1]
  );

  const { exists: pairExists, pairAddress: pair } = useV3CheckPair(
    convertETHToWETHIfApplicable(t0 ?? zeroAddress, chainId),
    convertETHToWETHIfApplicable(t1 ?? zeroAddress, chainId),
    tickSpacing,
    15000
  );
  const { data: slot0Data } = useV3CheckPoolSlot0({
    pool: pair,
    refetchInterval: 15000,
  });

  const currentPrice = useMemo(() => {
    if (!asset0 || !asset1) return 0;
    let sqrtPrice = Number(slot0Data[0]) / Math.pow(2, 96);
    sqrtPrice =
      Math.pow(sqrtPrice, 2) / Math.pow(10, asset1.decimals - asset0.decimals);
    return sqrtPrice;
  }, [asset0, asset1, slot0Data]);

  const tickLower = useMemo(() => {
    let min = parseFloat(minPrice);
    if (isNaN(min)) {
      const _preset = PRESETS.NARROW;
      min = (_preset.min * currentPrice) / 100;
      min = currentPrice - min;
    }
    return min > 0
      ? nearestUsableTick(tickSpacing, priceToTick(min, BASIS_POINT))
      : 0;
  }, [currentPrice, minPrice, tickSpacing]);

  const tickUpper = useMemo(() => {
    let max = parseFloat(maxPrice);
    if (isNaN(max)) {
      const _preset = PRESETS.NARROW;
      max = (_preset.max * currentPrice) / 100;
      max = currentPrice + max;
    }
    return max > 0
      ? nearestUsableTick(tickSpacing, priceToTick(max, BASIS_POINT))
      : max;
  }, [currentPrice, maxPrice, tickSpacing]);

  const amount0Parsed = useMemo(() => {
    if (isNaN(Number(amount0Bounced)) || !isFinite(Number(amount0Bounced)))
      return 0n;

    const roundedBounced = Number(amount0Bounced).toFixed(4);
    return parseUnits(roundedBounced, asset0?.decimals ?? 18);
  }, [amount0Bounced, asset0]);

  const amount1Parsed = useMemo(() => {
    if (isNaN(Number(amount1Bounced)) || !isFinite(Number(amount1Bounced)))
      return 0n;

    const roundedBounced = Number(amount1Bounced).toFixed(4);
    return parseUnits(roundedBounced, asset1?.decimals ?? 18);
  }, [amount1Bounced, asset1]);

  const matchesPreset = useCallback(
    (pr: keyof typeof PRESETS) => {
      const _preset = PRESETS[pr];
      return (
        Number(minPrice) ===
          currentPrice - (_preset.min * currentPrice) / 100 &&
        Number(maxPrice) === currentPrice + (_preset.max * currentPrice) / 100
      );
    },
    [currentPrice, maxPrice, minPrice]
  );

  // Check allowance
  const token0AllowanceCheck = useCheckAllowance(
    asset0?.address,
    positionManager,
    amount0Parsed,
    10000
  );
  const token1AllowanceCheck = useCheckAllowance(
    asset1?.address,
    positionManager,
    amount1Parsed,
    10000
  );

  const { amount0: amount0Quote, amount1: amount1Quote } =
    useV3QuoteAddLiquidity(
      t0 ?? zeroAddress,
      t1 ?? zeroAddress,
      tickSpacing,
      tickLower,
      tickUpper,
      0n,
      amount0Parsed,
      amount1Parsed,
      positionId || undefined,
      false
    );
  const {
    execute: executeInitLiquidity,
    isPending: initLiquidityPending,
    isSuccess: initLiquiditySuccess,
    reset: resetInitLP,
    isError: initLPError,
  } = useV3InitializeLiquidity({
    token0: t0 ?? zeroAddress,
    token1: t1 ?? zeroAddress,
    tickSpacing,
    tickLower,
    tickUpper,
    amountADesired: amount0Parsed,
    amountBDesired: amount1Parsed,
    sqrtPriceX96: 0n,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Added Liquidity",
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token0AllowanceCheck.refresh();
      void token1AllowanceCheck.refresh();
    },
    onError: (err) =>
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const {
    execute: executeGrantApproval0,
    isPending: approval0Pending,
    reset: resetApproval0,
    isSuccess: approval0Success,
    isError: approval0Error,
  } = useGrantApproval({
    token: asset0?.address,
    spender: positionManager,
    amount: maxUint256,
    onSuccess: (hash) => {
      setToast({
        actionTitle: `Approved to spend ${asset0?.symbol}`,
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token0AllowanceCheck.refresh();
    },
    onError: (err) =>
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const {
    execute: executeGrantApproval1,
    isPending: approval1Pending,
    reset: resetApproval1,
    isSuccess: approval1Success,
    isError: approval1Error,
  } = useGrantApproval({
    token: asset1?.address,
    spender: positionManager,
    amount: maxUint256,
    onSuccess: (hash) => {
      setToast({
        actionTitle: `Approved to spend ${asset1?.symbol}`,
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token1AllowanceCheck.refresh();
    },
    onError: (err) =>
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const isETH = useMemo(
    () =>
      t0?.toLowerCase() === ETHER.toLowerCase() ||
      t1?.toLowerCase() === ETHER.toLowerCase(),
    [t0, t1]
  );
  const nonETHIndex = useMemo(
    () =>
      isETH ? (t0?.toLowerCase() === ETHER.toLowerCase() ? 1 : 0) : undefined,
    [isETH, t0]
  );
  const {
    execute: executeIncreaseLiquidity,
    isPending: increaseLiquidityPending,
    isSuccess: increaseLiquiditySuccess,
    reset: resetIncreaseLP,
    isError: increaseLPError,
  } = useV3IncreaseLiquidity({
    tokenId: positionId || 0n,
    isETH,
    nonETHIndex,
    amountADesired: amount0Parsed,
    amountBDesired: amount1Parsed,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Added Liquidity",
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token0AllowanceCheck.refresh();
      void token1AllowanceCheck.refresh();
    },
    onError: (err) =>
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const { balance: balance0, refresh: refresh0 } = useGetBalance(
    asset0?.address,
    15000
  );
  const { balance: balance1, refresh: refresh1 } = useGetBalance(
    asset1?.address,
    15000
  );

  const onSubmit = useCallback(() => {
    if (!token0AllowanceCheck.isAllowed) {
      executeGrantApproval0();
      return;
    }

    if (!token1AllowanceCheck.isAllowed) {
      executeGrantApproval1();
      return;
    }

    if (positionId && positionId > 0n) {
      executeIncreaseLiquidity();
      return;
    } else {
      executeInitLiquidity();
      return;
    }
  }, [
    token0AllowanceCheck.isAllowed,
    token1AllowanceCheck.isAllowed,
    positionId,
    executeGrantApproval0,
    executeGrantApproval1,
    executeIncreaseLiquidity,
    executeInitLiquidity,
  ]);

  const errorMessage = useMemo(() => {
    if (balance0 < amount0Parsed || balance1 < amount1Parsed)
      return STRINGS.INSUFFICIENT_BALANCE;
  }, [balance0, balance1, amount0Parsed, amount1Parsed]);

  const buttonState = useMemo(() => {
    if (
      approval0Pending ||
      approval1Pending ||
      initLiquidityPending ||
      increaseLiquidityPending
    )
      return ButtonState.Loading;
    else return ButtonState.Default;
  }, [
    approval0Pending,
    approval1Pending,
    initLiquidityPending,
    increaseLiquidityPending,
  ]);

  const stateValid = useMemo(
    () =>
      !!token0 &&
      !!token1 &&
      (token0AllowanceCheck.isAllowed && token1AllowanceCheck.isAllowed
        ? balance0 >= amount0Parsed &&
          balance1 >= amount1Parsed &&
          amount0Parsed > 0n &&
          amount1Parsed > 0n &&
          !isNaN(Number(amount0)) &&
          !isNaN(Number(amount1))
        : true),
    [
      token0,
      token1,
      token0AllowanceCheck.isAllowed,
      token1AllowanceCheck.isAllowed,
      balance0,
      amount0Parsed,
      balance1,
      amount1Parsed,
      amount0,
      amount1,
    ]
  );

  const now = useAtomicDate(30000);
  const relevantTS = useMemo(() => {
    const n = Math.floor(now.getTime() / 1000);
    const weekAgo = n - TIME.WEEK;
    return BigInt(calculateEpochStartNow(weekAgo));
  }, [now]);
  const { useGaugeForPool } = useVoterCalls();
  const { useCheckGaugeRewardRate, useCheckGaugeRewardRateByTimestamp } =
    useGaugeCalls();
  const { gauge: gaugeAddress } = useGaugeForPool({
    pool: pair,
    refetchInterval: 30000,
  });
  const { data: rewardRate } = useCheckGaugeRewardRate({
    gaugeType: GaugeType.CL,
    address: gaugeAddress,
    refetchInterval: 30000,
  });
  const { data: rewardRateIn7Days } = useCheckGaugeRewardRateByTimestamp({
    gaugeType: GaugeType.CL,
    address: gaugeAddress,
    refetchInterval: 30000,
    timestamp: relevantTS,
  });

  const { useQLGetSinglePool } = usePoolQueries();
  const { useQLGetTokenDailyAnalytics } = useAnalyticQueries();
  const { data: QLSP, refetch: refetchQLSP } = useQLGetSinglePool(pair, 10000);
  const { data: QLToken0DailyAnalytics } = useQLGetTokenDailyAnalytics(
    convertETHToWETHIfApplicable(t0 ?? zeroAddress, chainId),
    500,
    30000
  );
  const { data: QLToken1DailyAnalytics } = useQLGetTokenDailyAnalytics(
    convertETHToWETHIfApplicable(t1 ?? zeroAddress, chainId),
    500,
    30000
  );

  const routerNav = useRouter();

  // const priceRangeInUSD0 = useMemo(() => {
  //   return Array.from(
  //     { length: 2000 },
  //     (_, i) => Math.random() * (1.01004966209 - 1.00501226962) + 1.00501226962
  //   ).map((p) => ({ x: p, y: priceToTick(p, BASIS_POINT) }));
  // }, []);

  // const priceRangeInUSD1 = useMemo(() => {
  //   return Array.from(
  //     { length: 2000 },
  //     (_, i) => Math.random() * (1.01004966209 - 1.00501226962) + 1.00501226962
  //   ).map((p) => ({ x: p, y: priceToTick(p, BASIS_POINT) }));
  // }, []);

  const { reserve0, reserve1, total } = useMemo(() => {
    if (!QLSP || !QLSP.Pool_by_pk)
      return { reserve0: 0, reserve1: 0, total: 0 };
    const reserve0 = parseFloat(QLSP.Pool_by_pk.reserve0);
    const reserve1 = parseFloat(QLSP.Pool_by_pk.reserve1);
    const total = reserve0 + reserve1;
    return { reserve0, reserve1, total };
  }, [QLSP]);

  const { ratio0, ratio1 } = useMemo(() => {
    if (!QLSP || !QLSP.Pool_by_pk || !token0 || !token1)
      return { ratio0: 0, ratio1: 0 };
    if (total === 0) return { ratio0: 0, ratio1: 0 };
    return QLSP.Pool_by_pk.token0?.address.toLowerCase() ===
      convertETHToWETHIfApplicable(token0.address, chainId).toLowerCase()
      ? { ratio0: (reserve0 * 100) / total, ratio1: (reserve1 * 100) / total }
      : { ratio0: (reserve1 * 100) / total, ratio1: (reserve0 * 100) / total };
  }, [QLSP, chainId, reserve0, reserve1, token0, token1, total]);

  const priceYData = useMemo(() => {
    if (!QLToken0DailyAnalytics && !QLToken1DailyAnalytics) return [];
    const p0 = QLToken0DailyAnalytics
      ? QLToken0DailyAnalytics.TokenDayData.map((d) => ({
          priceY: parseFloat(d.priceUSD),
        }))
      : [];
    const p1 = QLToken1DailyAnalytics
      ? QLToken1DailyAnalytics.TokenDayData.map((d) => ({
          priceY: parseFloat(d.priceUSD),
        }))
      : [];
    return baseToken === 0 ? p0.concat(p1) : p1.concat(p0); // Merge prices Y
  }, [QLToken0DailyAnalytics, QLToken1DailyAnalytics, baseToken]);

  const priceXData = useMemo(() => {
    const minTick = nearestUsableTick(tickSpacing, TICKS.MIN);
    const maxTick = nearestUsableTick(tickSpacing, TICKS.MAX);
    const result = Array.from(
      { length: maxTick - minTick + 1 },
      (_, index) => minTick + index
    ).map((val) => ({
      priceX: BASIS_POINT ** val,
      matchesCurrentTick:
        Math.sqrt(currentPrice) === Math.sqrt(BASIS_POINT ** val) && pairExists,
    }));

    if (!result.some((i) => i.matchesCurrentTick) && currentPrice > 0) {
      result.push({
        priceX: currentPrice,
        matchesCurrentTick: true,
      });
    }

    return result;
  }, [currentPrice, pairExists, tickSpacing]);

  const mergedDataXY = useMemo(() => {
    return priceXData.map((p, index) => {
      // Find corresponding priceYData using index
      const correspondingPriceY = priceYData.at(index);
      return correspondingPriceY
        ? { ...p, ...correspondingPriceY }
        : { ...p, priceY: 0, isUndefined: true };
    });
  }, [priceXData, priceYData]);

  // Chart controls
  const [xDomain, setXDomain] = useState<[number, number]>([0, 100]);
  const zoomX = useCallback(
    (factor: number) => {
      const [min, max] = xDomain;
      const center = (min + max) / 2;
      const range = (max - min) / factor;
      setXDomain([center - range / 2, center + range / 2]);
    },
    [xDomain]
  );
  const resetX = useCallback(
    () =>
      setXDomain([
        Math.min(
          ...mergedDataXY
            .filter(
              (d) => (d.priceX > 0 && d.priceY > 0) || d.matchesCurrentTick
            )
            .map((d) => d.priceX)
        ),
        Math.max(
          ...mergedDataXY
            .filter(
              (d) => (d.priceX > 0 && d.priceY > 0) || d.matchesCurrentTick
            )
            .map((d) => d.priceX)
        ),
      ]),
    [mergedDataXY]
  );

  // useEffect(() => {
  //   if (maxPrice < minPrice) {
  //     setMaxPrice(minPrice + 1);
  //   }
  // }, [maxPrice, minPrice]);

  // logic to set quote amounts to inputs
  useEffect(() => {
    if (selectedInput === "0")
      setAmount1(String(Number(amount0Bounced) * currentPrice));
    else if (selectedInput === "1") {
      setAmount0(String(Number(amount1Bounced) * (1 / currentPrice)));
    }
  }, [
    pairExists,
    selectedInput,
    amount0Parsed,
    amount1Parsed,
    asset0,
    asset1,
    amount1Quote,
    amount0Quote,
    amount0Bounced,
    amount1Bounced,
    currentPrice,
  ]);

  useEffect(() => {
    if (spacing) setTickSpacing(Number(spacing));
  }, [spacing]);

  useEffect(() => {
    if (!asset0 || !asset1) routerNav.push("/");
  }, [asset0, asset1, routerNav]);

  useEffect(() => {
    if (approval0Success || approval0Error) resetApproval0();
    if (approval1Success || approval1Error) resetApproval1();
    if (initLiquiditySuccess || initLPError) resetInitLP();
    if (increaseLiquiditySuccess || increaseLPError) resetIncreaseLP();

    Promise.all([refresh0(), refresh1(), refetchQLSP()])
      .then(() => console.info("Refreshed balances & pool"))
      .catch(console.error);
  }, [
    refresh0,
    refresh1,
    approval0Success,
    approval0Error,
    approval1Success,
    approval1Error,
    resetApproval0,
    resetApproval1,
    refetchQLSP,
    initLiquiditySuccess,
    resetInitLP,
    increaseLiquiditySuccess,
    resetIncreaseLP,
    initLPError,
    increaseLPError,
  ]);

  useEffect(() => {
    const _preset = PRESETS[preset];
    const minValue = currentPrice - (_preset.min * currentPrice) / 100;
    const maxValue = currentPrice + (_preset.max * currentPrice) / 100;
    setMinPrice(String(minValue));
    setMaxPrice(String(maxValue));
  }, [currentPrice, preset]);

  useEffect(
    () =>
      setXDomain([
        Math.min(
          ...mergedDataXY
            .filter(
              (d) => (d.priceX > 0 && d.priceY > 0) || d.matchesCurrentTick
            )
            .map((d) => d.priceX)
        ),
        Math.max(
          ...mergedDataXY
            .filter(
              (d) => (d.priceX > 0 && d.priceY > 0) || d.matchesCurrentTick
            )
            .map((d) => d.priceX)
        ),
      ]),
    [mergedDataXY]
  );

  const { width: windowWidth = 0 } = useWindowDimensions();

  // useEffect(() => {
  //   console.log(sqrtPriceX96ToPriceReadable(
  //       Number(sqrtPriceX96Min),
  //       asset0?.decimals,
  //       asset1?.decimals
  //     ),"000000");
  // },[asset0?.decimals, asset1?.decimals, sqrtPriceX96Min]);

  // const minPossiblePrice = useMemo(() => {
  //   const [] =
  // }, []);
  return (
    <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-center lg:items-start gap-4 w-full">
      <Card
        bg="1000"
        border="900"
        className="w-full lg:w-[760px] space-y-4 self-stretch"
      >
        <Step title="1. Select a mode" checked={true} />
        <div className="gap-x-2 flex">
          <Button variant="primary">Manual</Button>
          <Button variant="outline">Automatic</Button>
        </div>
        <div className="pt-2"></div>
        <Step title="2. Select a mode" checked={true} />
        <Card bg="950" border="900">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-neutral-400 text-xs md:text-sm">
                Current price
              </span>
              <span className="text-primary-400 text-xs md:text-sm">
                {baseToken === 0 ? (
                  <span>
                    1 {asset0?.symbol} ={" "}
                    <DisplayFormattedNumber
                      num={formatNumber(currentPrice, 3)}
                    />{" "}
                    {asset1?.symbol}
                  </span>
                ) : (
                  <span>
                    1 {asset1?.symbol} ={" "}
                    <DisplayFormattedNumber
                      num={formatNumber(1 / currentPrice, 3)}
                    />{" "}
                    {asset0?.symbol}
                  </span>
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-400 text-xs md:text-sm">
                {asset0?.symbol} ratio
              </span>
              <span className="text-xs md:text-sm">
                {!pairExists || pair === zeroAddress || !QLSP
                  ? "0%"
                  : `${ratio0.toFixed(3)}%`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-400 text-xs md:text-sm">
                {asset1?.symbol} ratio
              </span>
              <span className="text-xs md:text-sm">
                {!pairExists || pair === zeroAddress || !QLSP
                  ? "0%"
                  : `${ratio1.toFixed(3)}%`}
              </span>
            </div>
            <div className="flex items-center">
              <Tabs value={baseToken.toString()}>
                <TabsList
                  border="border-1"
                  colors="muted"
                  className="text-xs md:text-sm"
                >
                  <TabsTrigger onClick={() => setBaseToken(0)} value="0">
                    {windowWidth < 601
                      ? asset0?.symbol.slice(0, 1)
                      : asset0?.symbol}
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setBaseToken(1)} value="1">
                    {windowWidth < 601
                      ? asset1?.symbol.slice(0, 1)
                      : asset1?.symbol}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </Card>
        {!positionId && (
          <>
            <div>
              <div className="text-neutral-400 text-sm pb-1">
                <label htmlFor="">Presets</label>
              </div>

              <div className="gap-x-2 flex">
                <Button
                  onClick={() => setPreset("FULL")}
                  variant={matchesPreset("FULL") ? "primary" : "outline"}
                >
                  Full Range
                </Button>
                <Button
                  onClick={() => setPreset("WIDE")}
                  variant={matchesPreset("WIDE") ? "primary" : "outline"}
                >
                  Wide
                </Button>
                <Button
                  onClick={() => setPreset("COMMON")}
                  variant={matchesPreset("COMMON") ? "primary" : "outline"}
                >
                  Common
                </Button>
                <Button
                  onClick={() => setPreset("NARROW")}
                  variant={matchesPreset("NARROW") ? "primary" : "outline"}
                >
                  Narrow
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 pb-2 text-sm">
              <PriceInput
                value={minPrice}
                onChange={(value) => setMinPrice(String(value))}
                min={0}
                max={Number.POSITIVE_INFINITY}
                label={`Min ${asset1?.symbol} per ${asset0?.symbol}`}
                onIncrement={() => {
                  const _preset = PRESETS[preset];
                  const currentMinPrice = Number(minPrice);
                  if (currentMinPrice <= 0) return;
                  const value =
                    currentMinPrice + (_preset.max * currentMinPrice) / 100;
                  setMinPrice(String(value));
                }}
                onDecrement={() => {
                  const _preset = PRESETS[preset];
                  const currentMinPrice = Number(minPrice);
                  if (currentMinPrice <= 0) return;
                  const value =
                    currentMinPrice - (_preset.min * currentMinPrice) / 100;
                  setMinPrice(String(value));
                }}
              />
              <PriceInput
                value={maxPrice}
                onChange={(value) => setMaxPrice(String(value))}
                min={0}
                max={Number.POSITIVE_INFINITY}
                label={`Max ${asset1?.symbol} per ${asset0?.symbol}`}
                onIncrement={() => {
                  const _preset = PRESETS[preset];
                  const currentMaxPrice = Number(maxPrice);
                  if (currentMaxPrice <= 0) return;
                  const value =
                    currentMaxPrice + (_preset.max * currentMaxPrice) / 100;
                  setMaxPrice(String(value));
                }}
                onDecrement={() => {
                  const _preset = PRESETS[preset];
                  const currentMaxPrice = Number(maxPrice);
                  if (currentMaxPrice <= 0) return;
                  const value =
                    currentMaxPrice - (_preset.min * currentMaxPrice) / 100;
                  setMaxPrice(String(value));
                }}
              />
            </div>
          </>
        )}

        <Step title="3. Input amounts" checked={true} />
        <div className="relative space-y-2 ">
          <div className="bg-neutral-950 absolute flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  h-7 w-7 rounded-full">
            <Plus size={16} />
          </div>
          <AmountInput
            token={asset0}
            min={0}
            value={amount0}
            onChange={setAmount0}
            onMaxClick={() => {
              setSelectedInput("0");
              setAmount0(formatUnits(balance0, asset0?.decimals ?? 18));
            }}
            onFocus={() => setSelectedInput("0")}
            balance={formatNumber(
              formatUnits(balance0, asset0?.decimals ?? 18)
            )}
          />
          <AmountInput
            token={asset1}
            min={0}
            value={amount1}
            onChange={setAmount1}
            onMaxClick={() => {
              setSelectedInput("1");
              setAmount1(formatUnits(balance1, asset1?.decimals ?? 18));
            }}
            onFocus={() => setSelectedInput("1")}
            balance={formatNumber(
              formatUnits(balance1, asset1?.decimals ?? 18)
            )}
          />
        </div>
        <Card border="900" bg="950">
          <div className="flex justify-between">
            <div className="flex justify-center gap-3 items-start">
              <ChartNoAxesCombined size={20} color="#8062f1" />
              <span>Estimated APR</span>
            </div>
            <span className="text-xs lg:text-sm text-primary-500">
              <DisplayFormattedNumber
                num={formatNumber(formatEther(rewardRate))}
              />
              %
            </span>
          </div>
        </Card>
        <SubmitButton
          state={buttonState}
          isValid={stateValid}
          validationError={errorMessage}
          onClick={onSubmit}
        >
          {!token0AllowanceCheck.isAllowed ||
          !token1AllowanceCheck.isAllowed ? (
            <>
              {!token0AllowanceCheck.isAllowed
                ? `Approve ${token0?.symbol}`
                : `Approve ${token1?.symbol}`}
            </>
          ) : positionId && positionId > 0n ? (
            "Update Position"
          ) : (
            "Create Position"
          )}
        </SubmitButton>
      </Card>

      <Card
        bg="1000"
        border="900"
        className="w-full lg:w-[760px] space-y-6 self-stretch"
      >
        <Card bg="950" className="py-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#8062f1]">RANGE</span> VISUALIZER
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => zoomX(2)}
                className="text-xl rounded-full flex items-center justify-center"
              >
                <ZoomIn size={18} color="#595966" />
              </button>
              <button
                onClick={() => zoomX(0.5)}
                className="text-xl rounded-full flex items-center justify-center"
              >
                <ZoomOut size={18} color="#595966" />
              </button>
              <button
                onClick={resetX}
                className="text-xl rounded-full flex items-center justify-center"
              >
                <RefreshCcw size={18} color="#595966" />
              </button>
            </div>
          </div>
        </Card>
        <div className="flex justify-start w-full items-center gap-3">
          <div className="flex justify-center gap-2 items-center">
            <span className="text-[#d4d4d8] text-xs lg:text-sm">From</span>
            <div className="bg-[#1f1f29] w-16 lg:w-40 text-xs lg:text-sm p-1 rounded-[4px]">
              <DisplayFormattedNumber num={formatNumber(minPrice, 4)} />
            </div>
          </div>

          <div className="flex justify-center gap-2 items-center">
            <span className="text-[#d4d4d8] text-xs lg:text-sm">To</span>
            <div className="bg-[#1f1f29] w-16 lg:w-40 text-xs lg:text-sm p-1 rounded-[4px]">
              <DisplayFormattedNumber num={formatNumber(maxPrice, 4)} />
            </div>
          </div>
        </div>

        <RangeVisualizationChart
          width="100%"
          height={400}
          priceData={mergedDataXY}
          minPrice={Number(minPrice)}
          maxPrice={Number(maxPrice)}
          onMinPriceChange={(min) => setMinPrice(String(min))}
          onMaxPriceChange={(max) => setMaxPrice(String(max))}
          xDomain={xDomain}
        />
        <div>
          <Card border="900" bg="950">
            <div className="flex justify-between">
              <span>7D Average APR</span>
              <span className="text-xs lg:text-sm text-primary-500">
                <DisplayFormattedNumber
                  num={formatNumber(formatEther(rewardRateIn7Days))}
                />
                %
              </span>
            </div>
          </Card>
          <div className="pt-4"></div>
          <div className="space-y-1">
            <div className="flex text-neutral-300 text-sm justify-between">
              <span>TVL</span>
              <span>
                $
                <DisplayFormattedNumber
                  num={formatNumber(QLSP?.Pool_by_pk?.reserveUSD || 0)}
                />
              </span>
            </div>

            <div className="flex text-neutral-300 text-sm justify-between">
              <span>Trade Volume</span>
              <span>
                $
                <DisplayFormattedNumber
                  num={formatNumber(QLSP?.Pool_by_pk?.volumeUSD || 0)}
                />
              </span>
            </div>

            <div className="flex text-neutral-300 text-sm justify-between">
              <span>Fees</span>
              <span>
                $
                <DisplayFormattedNumber
                  num={formatNumber(QLSP?.Pool_by_pk?.totalFeesUSD || 0)}
                />
              </span>
            </div>

            <div className="flex text-neutral-300 text-sm justify-between">
              <span>Incentives</span>
              <span>
                $
                <DisplayFormattedNumber
                  num={formatNumber(QLSP?.Pool_by_pk?.totalBribesUSD || 0)}
                />
              </span>
            </div>
          </div>
        </div>
        {/* <div className="flex text-neutral-300 text-sm justify-between">
          <span>Usable {token0?.symbol}</span>
          <span>
            <DisplayFormattedNumber
              num={formatNumber(
                formatUnits(amount0Quote, token0?.decimals ?? 18)
              )}
            />
          </span>
        </div>
        <div className="flex text-neutral-300 text-sm justify-between">
          <span>Usable {token1?.symbol}</span>
          <span>
            <DisplayFormattedNumber
              num={formatNumber(
                formatUnits(amount1Quote, token1?.decimals ?? 18)
              )}
            />
          </span>
        </div> */}
        {/* <div className="flex text-neutral-300 text-sm justify-between">
          <span>Anticipated Added LP</span>
          <span>
            <DisplayFormattedNumber num={formatNumber(formatEther(lpQuote))} />{" "}
            lps
          </span>
        </div> */}
      </Card>
    </div>
  );
}

interface PriceInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
  min: number;
  max: number;
  disabled?: boolean;
}

function PriceInput({
  value,
  onChange,
  label,
  min,
  max,
  disabled,
  onIncrement,
  onDecrement,
}: PriceInputProps) {
  return (
    <div>
      <div className="py-1">
        <label htmlFor="">{label || "Price"}</label>
      </div>
      <Card bg="950" border="none" className="py-2">
        <div className="flex items-center gap-x-2 justify-center w-full">
          <button
            onClick={onIncrement}
            disabled={disabled}
            className="border-white text-xl border rounded-full flex items-center justify-center h-6 w-6"
          >
            <Plus />
          </button>
          <Input
            disabled={disabled}
            min={min}
            max={max}
            className="h-8 flex-1 outline-none"
            placeholder="0"
            textSize={"lg"}
            variant={"transparent"}
            value={value}
            type="number"
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            disabled={disabled}
            onClick={onDecrement}
            className="border-white text-xl border rounded-full flex items-center justify-center h-6 w-6"
          >
            <Minus />
          </button>
        </div>
      </Card>
    </div>
  );
}
function Step({ title, checked }: { title: string; checked: boolean }) {
  return (
    <Card bg="950" className="py-2">
      <div className="flex justify-between">
        <div>{title}</div>
        {checked && (
          <div>
            <Check className="text-primary-400" />
          </div>
        )}
      </div>
    </Card>
  );
}

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  token?: TToken;
  balance: string;
  onFocus?: () => void;
  onMaxClick?: () => void;
}

function AmountInput({
  value,
  onChange,
  min,
  max,
  token,
  balance,
  onFocus,
  onMaxClick,
}: AmountInputProps) {
  return (
    <Card border="900" className="py-3">
      <div className="flex justify-between">
        <div className="w-[90%] flex items-start flex-col gap-y-2">
          <div className="w-full">
            <Input
              type="number"
              min={min}
              max={max}
              value={value}
              className="h-8 outline-none w-full"
              textSize="lg"
              placeholder="0"
              variant="transparent"
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
            />
          </div>
          <div className="pl-3">-</div>
        </div>
        <div>
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-start gap-x-2 text-sm bg-neutral-950 p-1 rounded-md w-full">
              <ImageWithFallback
                src={token?.logoURI || ""}
                width={10}
                height={10}
                alt={token?.symbol || ""}
                className="rounded-full"
              />
              <span>{token?.symbol}</span>
            </div>
            <div className="flex gap-x-1 text-sm">
              <span className="text-neutral-400">
                <DisplayFormattedNumber num={balance} />
              </span>
              <button onClick={onMaxClick} className="text-primary-400">
                Max
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
