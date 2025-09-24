import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md  px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      colors: {
        neutral: "border-neutral-700 border ",
        success: "bg-success-400/15 text-success-400 border-success-400",
        error: "bg-error-400/15 text-error-400 border-error-400",
        yellow: "bg-yellow/15 text-yellow border-yellow",
        primary: "bg-primary-400/15 text-primary-400 border-primary-400",
      },
      border: {
        one: "border",
        none: "",
      },
      size: {
        sm: "text-[12px] h-[20px] font-normal leading-[12px] py-[2px] px-[4px]",
        md: "text-sm font-normal leading-[16px] py-[4px] px-[6px]",
        full: "text-sm w-full flex justify-center  font-normal leading-[16px] py-[4px] px-[6px]",
      },
    },
    defaultVariants: {
      colors: "success",
      border: "none",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, border, colors, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ colors, border, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
