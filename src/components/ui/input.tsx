import { cn } from "@/lib/utils";
export { Input };
import React from "react";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  `flex h-10 w-full rounded-md border border-input bg-background
   px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent
   file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground
   focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 md:text-sm outline-none`,
  {
    variants: {
      ring: {
        none: "",
        ringOne: `focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2`,
      },
      variant: {
        transparent: "bg-transparent ring-0 border-none",
        neutral: "bg-neutral-950",
      },
      textSize: {
        sm: "md:text-sm md:placeholder:text-sm",
        md: "md:text-md md:placeholder:text-md",
        lg: "md:text-lg md:placeholder:text-lg",
        xl: "md:text-xl md:placeholder:text-xl",
        ["2xl"]: "md:text-2xl md:placeholder:text-2xl",
      },
    },
    defaultVariants: {
      ring: "none",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}
/**
 * Input
 * Style props -
 * Variant
 * textSize
 * ring
 **/
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ring, variant, textSize, ...props }, ref) => {
    return (
      <input
        type="text"
        className={cn(inputVariants({ variant, ring, textSize }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
