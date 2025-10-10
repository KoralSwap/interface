import { useTokenlistContext } from "@/contexts/tokenlistContext";
import { ChainId, ETHER, TICKS, TIME, WETH } from "@/data/constants";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { Address, formatUnits } from "viem";

export function useGetTokenInfo(address: string | undefined) {
  const { tokenlist } = useTokenlistContext();
  return useMemo(
    () =>
      tokenlist.find(
        (token) => token.address.toLowerCase() === address?.toLowerCase()
      ),
    [address, tokenlist]
  );
}

export function inputPatternNumberMatch(s: string, decimals = 18) {
  const pattern = /^[0-9]*[.,]?[0-9]*$/;
  const decimalPattern = RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);
  if (s === "") {
    return true;
  }
  if (pattern.test(s) && decimalPattern.test(s)) return true;
  return false;
}

export function convertWETHToPlainETHIfApplicable(
  address: Address,
  chainId: number = ChainId.KONET
) {
  return address.toLowerCase() === WETH[chainId].toLowerCase()
    ? ETHER
    : address;
}

export function convertETHToWETHIfApplicable(
  address: Address,
  chainId: number = ChainId.KONET
) {
  return address.toLowerCase() === ETHER.toLowerCase()
    ? WETH[chainId]
    : address;
}

export function nearestUsableTick(
  tickSpacing: number,
  tickBasis: number = TICKS.MIN
) {
  const rounded = Math.round(tickBasis / tickSpacing) * tickSpacing;
  return rounded < TICKS.MIN
    ? rounded + tickSpacing
    : rounded > TICKS.MAX
      ? rounded - tickSpacing
      : rounded;
}

// export function getMaxLiquidityPerTick(tickSpacing: number) {
//   return (
//     (Math.pow(2, 128) - 1) /
//     ((getMaxTick(tickSpacing) - getMinTick(tickSpacing)) / tickSpacing + 1)
//   );
// }

export function tickToPrice(tick: number, basisPoint: number = 1.0001) {
  return basisPoint ** tick;
}

export function priceToTick(price: number, basisPoint: number = 1.0001) {
  return Math.floor(Math.log(price) / Math.log(basisPoint));
}

export function sqrtPriceToTick(
  sqrtPrice: number,
  basisPoint: number = 1.0001,
  decimals0: number = 18,
  decimals1: number = 18
) {
  const price = sqrtPrice ** 2;
  const readablePrice = price / 10 ** (decimals1 - decimals0);
  const tick = Math.floor(Math.log(readablePrice) / Math.log(basisPoint));
  return tick;
}

export function sqrtPriceX96ToPriceReadable(
  sqrtPriceX96: number,
  decimals0: number = 18,
  decimals1: number = 18
) {
  const sqrtPrice = sqrtPriceX96 / 2 ** 96;
  const price = sqrtPrice ** 2;
  return price / 10 ** (decimals1 - decimals0);
}

export function getVirtualLiquidity(
  vX: number,
  sqrtPriceMax: number,
  sqrtPriceCurrent: number
) {
  return (
    (vX * (sqrtPriceMax * sqrtPriceCurrent)) /
    (sqrtPriceMax > sqrtPriceCurrent ? sqrtPriceMax - sqrtPriceCurrent : 1)
  );
}

export function getVirtualY(
  vX: number,
  sqrtPriceMin: number,
  sqrtPriceMax: number,
  sqrtPriceCurrent: number
) {
  const vl = getVirtualLiquidity(vX, sqrtPriceMax, sqrtPriceCurrent);
  return (
    vl *
    (sqrtPriceCurrent > sqrtPriceMin
      ? sqrtPriceCurrent - sqrtPriceMin
      : sqrtPriceMin)
  );
}

export function encodeSQRT(reserve0: bigint, reserve1: bigint) {
  const reserve0BN = new BigNumber(reserve0.toString(16), 16);
  const reserve1BN = new BigNumber(reserve1.toString(16), 16);
  return BigInt(
    reserve1BN
      .div(reserve0BN)
      .sqrt()
      .multipliedBy(new BigNumber(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

export function calculateEpochStartNow(
  now: number = Math.floor(Date.now() / 1000)
) {
  return now - (now % TIME.WEEK);
}

export function determinePriceImpact(
  reserve0: bigint | number,
  reserve1: bigint | number,
  amountIn: bigint | number,
  amountReceived: bigint | number,
  decimals0: number,
  decimals1: number
) {
  const _reserve0 =
    typeof reserve0 === "bigint"
      ? parseFloat(formatUnits(reserve0, decimals0))
      : reserve0;
  const _reserve1 =
    typeof reserve1 === "bigint"
      ? parseFloat(formatUnits(reserve1, decimals1))
      : reserve1;
  const _amountIn =
    typeof amountIn === "bigint"
      ? parseFloat(formatUnits(amountIn, decimals0))
      : amountIn;
  const _amountOut =
    typeof amountReceived === "bigint"
      ? parseFloat(formatUnits(amountReceived, decimals1))
      : amountReceived;

  if (_reserve1 === 0 || _amountOut === 0) return 0;

  // Market price => token0 / token1
  const currentPrice = _reserve0 / _reserve1;
  const pricePaid = _amountIn / _amountOut;
  const _ratio =
    currentPrice > 0 ? (pricePaid - currentPrice) / currentPrice : 0;
  return _ratio * 100;
}
