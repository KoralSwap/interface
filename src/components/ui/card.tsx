import * as React from "react";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
const cardVariants = cva("", {
  variants: {
    bg: {
      "1050": "bg-neutral-1050",
      "1000": "bg-neutral-1000",
      "950": "bg-neutral-950",
      "900": "bg-neutral-900",
      "800": "bg-neutral-800",
      "700": "bg-neutral-700",
      none: "",
    },
    border: {
      "1050": "border border-neutral-1050",
      "1000": "border border-neutral-1000",
      "950": "border border-neutral-950",
      "900": "border border-neutral-900",
      "800": "border border-neutral-800",
      "700": "border border-neutral-700",
      none: "",
    },
    rounded: {
      md: "rounded-md",
    },
    p: {
      "4": "p-4",
      "6": "p-6",
    },
  },
  defaultVariants: { rounded: "md", p: "4", border: "none", bg: "none" },
});
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, p, border, bg, rounded, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ p, rounded, className, border, bg }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(" pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
