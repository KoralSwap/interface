import * as React from "react";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

// Extended Card component with backward compatibility for 'bg' prop

const cardVariants = cva("rounded-xl border transition-all duration-200", {
  variants: {
    variant: {
      default: "border-neutral-900 bg-neutral-1000/50 backdrop-blur-sm",
      elevated: "border-neutral-900 bg-neutral-950 shadow-lg",
      glass: "border-neutral-900/50 bg-neutral-1000/30 backdrop-blur-xl",
      gradient:
        "border-blue-500/30 bg-gradient-mesh shadow-lg shadow-blue-500/10",
      outline: "border-neutral-900 bg-transparent",
      solid: "border-neutral-900 bg-neutral-1000",
    },
    bg: {
      "1050": "bg-neutral-1050",
      "1000": "bg-neutral-1000",
      "950": "bg-neutral-950",
      "900": "bg-neutral-900",
      "800": "bg-neutral-800",
      "700": "bg-neutral-700",
      none: "",
    },
    hover: {
      none: "",
      lift: "hover:scale-[1.02] hover:shadow-xl",
      glow: "hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20",
      both: "hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20",
    },
    p: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    },
  },
  defaultVariants: {
    variant: "default",
    hover: "none",
    p: "md",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, bg, hover, p, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, bg, hover, p, className }))}
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
    className={cn("flex flex-col space-y-1.5", className)}
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
      "text-xl font-bold leading-none tracking-tight text-white",
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
    className={cn("text-sm text-neutral-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
