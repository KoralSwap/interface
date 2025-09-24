import ImageWithFallback from "@/components/shared/imageWithFallback";
import { TToken } from "@/lib/types";
import { useMemo } from "react";

export default function AssetSymbolAndName({ token }: { token: TToken }) {
  const isRCT = useMemo(() => token?.symbol === "RCT", [token]);
  return !token ? undefined : (
    <div
      data-is-rct={isRCT ? "true" : "false"}
      className="data-[is-rct=true]:bg-primary-400 bg-neutral-900 flex gap-x-1 items-center justify-between rounded-md px-[1px] md:px-[2px] py-[2px] md:py-[4px]"
    >
      <ImageWithFallback
        width={24}
        height={24}
        className="h-3 w-3 md:w-6 md:h-6 rounded-full"
        src={token.logoURI}
        alt={token.symbol}
        avatar={
          !token.logoURI
            ? {
                letter: token.symbol[0].toUpperCase(),
                styles: "h-3 w-3 md:h-6 md:w-6",
                letterStyles: "text-[10px] leading-[10px]",
              }
            : undefined
        }
      />
      <span className="text-xs md:text-sm">{token.symbol}</span>
    </div>
  );
}
