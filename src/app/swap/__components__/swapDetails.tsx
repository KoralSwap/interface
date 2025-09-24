import { ChevronDown, Settings } from "lucide-react";
import React, { ReactNode, useMemo, useState } from "react";
import infoIcon from "@/assets/info.svg";
import Tooltip from "@/components/ui/tooltip";
import { Address, formatUnits, zeroAddress } from "viem";
import { TToken } from "@/lib/types";
import { useAtom } from "jotai";
import { settingDialogOpenAtom, slippageAtom } from "@/store";
import { HUNDRED_PERCENT_BN } from "@/data/constants";
import { useGetMarketQuote } from "@/lib/hooks/useGetMarketQuote";
import { formatNumber } from "@/lib/utils";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { convertETHToWETHIfApplicable, determinePriceImpact } from "@/utils";
import { useGetBalanceOf } from "@/lib/hooks/useGetBalance";
import { useChainId } from "wagmi";

interface Props {
  amountIn: bigint;
  amountOut: bigint;
  token0: TToken;
  token1: TToken;
  pair?: Address;
}
export default function SwapDetails({
  amountIn,
  amountOut,
  token0,
  token1,
  pair = zeroAddress,
}: Props) {
  const chainId = useChainId();
  const [open, setOpen] = useState(false);
  const [slippage] = useAtom(slippageAtom);
  const { balance: balance0 } = useGetBalanceOf(
    pair,
    convertETHToWETHIfApplicable(token0.address, chainId),
    30000
  );
  const { balance: balance1 } = useGetBalanceOf(
    pair,
    convertETHToWETHIfApplicable(token1.address, chainId),
    30000
  );

  const [, setDialogOpen] = useAtom(settingDialogOpenAtom);

  const { per, min } = useMemo(() => {
    if (amountOut === 0n) {
      return { per: 0n, min: 0n };
    }
    const per =
      parseFloat(formatUnits(amountOut, token1.decimals)) /
      parseFloat(formatUnits(amountIn, token0.decimals));
    const a = (amountOut * BigInt(slippage)) / HUNDRED_PERCENT_BN;
    const min = amountOut - a;
    return { min, per: per.toPrecision(4) };
  }, [amountIn, amountOut, slippage, token0.decimals, token1.decimals]);
  const { quote } = useGetMarketQuote({
    tokenAddress: convertETHToWETHIfApplicable(token1.address, chainId),
    value: amountOut,
  });

  const priceImpact = useMemo(
    () =>
      determinePriceImpact(
        balance0,
        balance1,
        amountIn,
        amountOut,
        token0.decimals,
        token1.decimals
      ),
    [amountIn, amountOut, balance0, balance1, token0.decimals, token1.decimals]
  );
  // address tokenA,
  // address tokenB,
  // uint256 amountIn,
  // bool multiHops
  return (
    <div className="text-[13px] border border-neutral-800 rounded-[16px] p-1 md:p-4 space-y-4">
      <Row
        title="Received Value"
        value={
          <>
            $
            <DisplayFormattedNumber
              num={formatNumber(formatUnits(quote[0], 18), 4)}
            />
          </>
        }
      />
      <Row
        title="Exchange Rate"
        value={
          <p>
            1 {token0.symbol} <span className="text-neutral-200">≃</span> {per}{" "}
            {token1.symbol}{" "}
          </p>
        }
      />
      <Row
        title="Slippage"
        value={
          <>
            <span>{slippage / 100}%</span>
            <button onClick={() => setDialogOpen(true)}>
              <Settings className="text-neutral-200" size={16} />
            </button>
          </>
        }
        info="Slippage Info"
      />
      <div>
        <button
          onClick={() => setOpen(!open)}
          type="button"
          className="text-primary-400 items-center text-sm flex gap-x-1"
        >
          <span>Show detailed Breakdown</span>
          <ChevronDown
            data-direction={open ? "up" : "down"}
            className="
          data-[direction=up]:rotate-180 transition-transform"
          />
        </button>
        <div
          data-state={open ? "open" : "closed"}
          className="pt-4 data-[state=closed]:opacity-0 transition-all duration-500 data-[state=closed]:h-0 overflow-hidden fade-in space-y-4"
        >
          <Row
            title="Minumum Receieved"
            value={
              <div>
                <DisplayFormattedNumber
                  num={formatNumber(formatUnits(min, token1.decimals), 4)}
                />
              </div>
            }
            info="Info"
          />
          {/* <Row title="Fee" value="$23.44" info="Info" /> */}
          <Row
            title="Price Impact"
            value={
              <div>
                <DisplayFormattedNumber num={formatNumber(priceImpact, 3)} />%
              </div>
            }
            info="Info"
          />
          {/* <Row title="Route" value="$23.44" info="Info" /> */}
        </div>
      </div>
    </div>
  );
}
function Row({
  title,
  value,
  info,
}: {
  title: string;
  value: ReactNode;
  info?: string;
}) {
  return (
    <div className="flex justify-between">
      <div className="text-neutral-400 flex gap-x-1">
        <span>{title}</span>
        {info && (
          <div>
            <Tooltip triggerImageSrc={infoIcon}>{info}</Tooltip>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-1">{value}</div>
    </div>
  );
}
