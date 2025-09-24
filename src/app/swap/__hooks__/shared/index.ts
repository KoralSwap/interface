import { V2_FACTORY, WETH } from "@/data/constants";
import { convertETHToWETHIfApplicable } from "@/utils";
import { Address } from "viem";

export enum SwapFlow {
  FROM_ETHER,
  TO_ETHER,
  BETWEEN_ERC20,
}

export interface V2SwapRoute {
  from: Address;
  to: Address;
  stable: boolean;
  factory: Address;
}

export interface V3QuoteSwapInputParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  tickSpacing: number;
  sqrtPriceLimitX96: bigint;
}

export interface V3SwapInputBaseProps {
  recipient: Address;
  amountIn: bigint;
  deadline: bigint;
  amountOutMinimum: bigint;
}

export interface V3SwapInputSingleParams extends V3SwapInputBaseProps {
  tokenIn: Address;
  tokenOut: Address;
  tickSpacing: number;
  sqrtPriceLimitX96: bigint;
}

export interface V3SwapInputParams extends V3SwapInputBaseProps {
  path: `0x${string}`;
}

export function deriveV2SwapRoutes(
  from: Address,
  to: Address,
  stable: boolean,
  chainId: number,
  isMultipath: boolean = false
) {
  const routes: V2SwapRoute[] = [];
  // Compose first
  const route: V2SwapRoute = {} as V2SwapRoute;
  route.from = convertETHToWETHIfApplicable(from, chainId);
  route.to =
    isMultipath && route.from.toLowerCase() !== WETH[chainId].toLowerCase()
      ? WETH[chainId]
      : convertETHToWETHIfApplicable(to, chainId);
  route.factory = V2_FACTORY[chainId];
  route.stable = stable;
  routes.push(route);

  if (isMultipath && route.to.toLowerCase() === WETH[chainId].toLowerCase()) {
    // Push extra route
    routes.push({
      from: WETH[chainId],
      to,
      factory: route.factory,
      stable,
    });
  }

  return routes;
}

function encodePath(path: Address[], tickSpacings: bigint[]): `0x${string}` {
  let finalString: `0x${string}` = "0x";
  tickSpacings.forEach((ts, index) => {
    finalString += path[index].slice(2);
    finalString += ts.toString(16).padStart(6, "0");
  });
  finalString += path[path.length - 1].slice(2);
  return finalString.toLowerCase() as `0x${string}`;
}

export function deriveV3QuotationParams(
  from: Address,
  to: Address,
  tickSpacing: number,
  sqrtPriceLimitX96: bigint,
  amountIn: bigint,
  chainId: number,
  isMultipath: boolean = false
) {
  if (!isMultipath) {
    const params: V3QuoteSwapInputParams = {} as V3QuoteSwapInputParams;
    params.amountIn = amountIn;
    params.tokenIn = convertETHToWETHIfApplicable(from, chainId);
    params.tokenOut = convertETHToWETHIfApplicable(to, chainId);
    params.tickSpacing = tickSpacing;
    params.sqrtPriceLimitX96 = sqrtPriceLimitX96;

    const swapFlow =
      params.tokenIn.toLowerCase() === WETH[chainId].toLowerCase()
        ? SwapFlow.FROM_ETHER
        : params.tokenOut.toLowerCase() === WETH[chainId].toLowerCase()
          ? SwapFlow.TO_ETHER
          : SwapFlow.BETWEEN_ERC20;
    return {
      isMultipath,
      params,
      swapFlow,
      value: swapFlow === SwapFlow.FROM_ETHER ? amountIn : undefined,
    };
  } else {
    const previousTo = to;
    from = convertETHToWETHIfApplicable(from, chainId);
    to =
      from.toLowerCase() !== WETH[chainId].toLowerCase()
        ? WETH[chainId]
        : convertETHToWETHIfApplicable(to, chainId);
    const path: Address[] = [from, to];
    if (to.toLowerCase() === WETH[chainId].toLowerCase()) path.push(previousTo);

    const swapFlow =
      path[0].toLowerCase() === WETH[chainId].toLowerCase()
        ? SwapFlow.FROM_ETHER
        : path[path.length - 1].toLowerCase() === WETH[chainId].toLowerCase()
          ? SwapFlow.TO_ETHER
          : SwapFlow.BETWEEN_ERC20;
    return {
      isMultipath,
      params: encodePath(path, new Array(path.length - 1).fill(tickSpacing)),
      swapFlow,
      value: swapFlow === SwapFlow.FROM_ETHER ? amountIn : undefined,
    };
  }
}

export function deriveV3SwapParams(
  from: Address,
  to: Address,
  recipient: Address,
  tickSpacing: number,
  sqrtPriceLimitX96: bigint,
  amountIn: bigint,
  chainId: number,
  deadline: bigint,
  amountOutMin: bigint = 0n,
  isMultipath: boolean = false
) {
  if (!isMultipath) {
    const params: V3SwapInputSingleParams = {} as V3SwapInputSingleParams;
    params.amountIn = amountIn;
    params.tokenIn = convertETHToWETHIfApplicable(from, chainId);
    params.tokenOut = convertETHToWETHIfApplicable(to, chainId);
    params.tickSpacing = tickSpacing;
    params.sqrtPriceLimitX96 = sqrtPriceLimitX96;
    params.amountOutMinimum = amountOutMin;
    params.deadline = deadline;
    params.recipient = recipient;

    const swapFlow =
      params.tokenIn.toLowerCase() === WETH[chainId].toLowerCase()
        ? SwapFlow.FROM_ETHER
        : params.tokenOut.toLowerCase() === WETH[chainId].toLowerCase()
          ? SwapFlow.TO_ETHER
          : SwapFlow.BETWEEN_ERC20;
    return {
      isMultipath,
      params,
      swapFlow,
      value: swapFlow === SwapFlow.FROM_ETHER ? amountIn : undefined,
    };
  } else {
    const previousTo = to;
    from = convertETHToWETHIfApplicable(from, chainId);
    to =
      from.toLowerCase() !== WETH[chainId].toLowerCase()
        ? WETH[chainId]
        : convertETHToWETHIfApplicable(to, chainId);
    const path: Address[] = [from, to];
    if (to.toLowerCase() === WETH[chainId].toLowerCase()) path.push(previousTo);

    const swapFlow =
      path[0].toLowerCase() === WETH[chainId].toLowerCase()
        ? SwapFlow.FROM_ETHER
        : path[path.length - 1].toLowerCase() === WETH[chainId].toLowerCase()
          ? SwapFlow.TO_ETHER
          : SwapFlow.BETWEEN_ERC20;

    const params: V3SwapInputParams = {} as V3SwapInputParams;
    params.path = encodePath(
      path,
      new Array(path.length - 1).fill(tickSpacing)
    );
    params.amountIn = amountIn;
    params.amountOutMinimum = amountOutMin;
    params.deadline = deadline;
    params.recipient = recipient;
    return {
      isMultipath,
      params,
      swapFlow,
      value: swapFlow === SwapFlow.FROM_ETHER ? amountIn : undefined,
    };
  }
}
