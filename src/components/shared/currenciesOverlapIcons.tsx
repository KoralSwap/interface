import React from "react";
import ImageWithFallback from "./imageWithFallback";
import { TToken } from "@/lib/types";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva("rounded-full", {
  variants: {
    size: {
      sm: "h-4 w-4  data-[a=a]:-ml-1 text-[8px]",
      md: "h-8 w-8 data-[a=a]:-ml-2 text-[11px]",
    },
  },
  defaultVariants: { size: "md" },
});

interface Props extends VariantProps<typeof variants> {
  token0: TToken;
  token1: TToken;
}

export default function CurrenciesOverlapIcons({
  token0,
  token1,
  size,
}: Props) {
  return (
    <div className="flex">
      <ImageWithFallback
        className={cn(variants({ size }))}
        width={35}
        height={35}
        src={token0.logoURI}
        alt={token0.symbol}
        avatar={{
          letter: token0.symbol[0].toUpperCase(),
          styles: cn(variants({ size })),
        }}
      />
      <ImageWithFallback
        data-a="a"
        className={cn(variants({ size, className: "z-10" }))}
        width={35}
        height={35}
        src={token1.logoURI}
        alt={token1.symbol}
        avatar={{
          letter: token1.symbol[0].toUpperCase(),
          styles: cn(variants({ size, className: "z-10 " })),
        }}
      />
    </div>
  );
}
