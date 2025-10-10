import Input from "@/components/ui/input";
import { ChevronDown, Wallet } from "lucide-react";
import Image from "next/image";
import { formatNumber, inputPatternMatch } from "@/lib/utils";
import { TToken } from "@/lib/types";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { useGetMarketQuote } from "@/lib/hooks/useGetMarketQuote";
import { useChainId } from "wagmi";
import { convertETHToWETHIfApplicable } from "@/utils";

interface Props {
  value: string;
  token: TToken | null;
  title: string;
  active: boolean;
  setValue?: (value: string) => void;
  onContainerClick: () => void;
  onButtonClick: () => void;
  disabled?: boolean;
}

export default function SwapCard({
  token,
  value,
  title,
  active,
  onContainerClick,
  onButtonClick,
  setValue,
  disabled,
}: Props) {
  const chainId = useChainId();
  const { balance } = useGetBalance(token?.address, 15000);
  const { quote } = useGetMarketQuote({
    tokenAddress: convertETHToWETHIfApplicable(
      token?.address ?? zeroAddress,
      chainId
    ),
    value: parseUnits(value, token?.decimals ?? 18),
  });

  return (
    <div
      onClick={onContainerClick}
      data-state={active ? "active" : "inactive"}
      className="group relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-1000/50 p-6 backdrop-blur-sm transition-all duration-200 data-[state=active]:border-blue-500/50 data-[state=active]:bg-neutral-950"
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-primary" />
      )}

      {/* Title */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-400">{title}</h2>
        {token && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Wallet size={14} />
            <span>
              <DisplayFormattedNumber
                num={formatNumber(formatUnits(balance, token?.decimals ?? 18))}
              />
            </span>
          </div>
        )}
      </div>

      {/* Input and Token Selector */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => {
              if (inputPatternMatch(e.target.value) && setValue) {
                setValue(e.target.value);
              }
            }}
            variant="ghost"
            inputSize="lg"
            className="h-auto border-none bg-transparent p-0 text-3xl font-bold placeholder:text-neutral-700 focus:ring-0"
            placeholder="0.00"
            disabled={disabled}
          />
        </div>

        {/* Token Button */}
        <button
          onClick={onButtonClick}
          className={`
            group/btn relative flex h-12 items-center gap-2 rounded-xl px-4 transition-all duration-200
            ${
              token
                ? "border border-neutral-800 bg-neutral-950 hover:border-blue-500/50 hover:bg-neutral-900"
                : "border-2 border-dashed border-neutral-800 bg-neutral-1000 hover:border-blue-500/50"
            }
          `}
        >
          {token && (
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 border-neutral-900">
              <Image
                fill
                className="object-cover"
                src={token.logoURI || ""}
                alt={token.name}
              />
            </div>
          )}
          <span className="whitespace-nowrap text-base font-semibold">
            {token ? token.symbol : "Select"}
          </span>
          <ChevronDown
            size={18}
            className="transition-transform group-hover/btn:translate-y-0.5"
          />
        </button>
      </div>

      {/* Bottom Row: USD Value and Max Button */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-neutral-500">
          {quote[0] > 0n && (
            <>
              ≈ $
              <DisplayFormattedNumber
                num={formatNumber(formatUnits(quote[0], 18))}
              />
            </>
          )}
        </span>
        {token !== null && setValue && (
          <button
            onClick={() => {
              setValue(formatUnits(balance, token?.decimals ?? 18));
            }}
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all duration-200 hover:bg-neutral-800 hover:text-white"
          >
            Max
          </button>
        )}
      </div>
    </div>
  );
}
