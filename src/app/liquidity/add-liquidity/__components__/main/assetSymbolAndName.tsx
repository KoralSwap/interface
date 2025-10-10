import ImageWithFallback from "@/components/shared/imageWithFallback";
import { TToken } from "@/lib/types";
import { useMemo } from "react";

export default function AssetSymbolAndName({ token }: { token: TToken }) {
  const isRCT = useMemo(() => token?.symbol === "RCT", [token]);
  return !token ? undefined : (
    <div
      data-is-rct={isRCT ? "true" : "false"}
      className="data-[is-rct=true]:bg-gradient-primary data-[is-rct=true]:shadow-md data-[is-rct=true]:shadow-blue-500/20 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex gap-x-2 md:gap-x-2.5 items-center justify-between rounded-lg px-2 sm:px-2.5 md:px-3 py-1.5 md:py-2 min-w-[80px] sm:min-w-[90px] md:min-w-[110px] transition-all duration-200"
    >
      <ImageWithFallback
        width={24}
        height={24}
        className="h-4 w-4 sm:h-5 sm:w-5 md:w-6 md:h-6 rounded-full flex-shrink-0"
        src={token.logoURI}
        alt={token.symbol}
        avatar={
          !token.logoURI
            ? {
                letter: token.symbol[0].toUpperCase(),
                styles: "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6",
                letterStyles: "text-[10px] sm:text-xs leading-tight",
              }
            : undefined
        }
      />
      <span className="text-xs sm:text-sm md:text-base font-medium text-white truncate">
        {token.symbol}
      </span>
    </div>
  );
}
