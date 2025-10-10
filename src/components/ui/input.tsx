import { cn } from "@/lib/utils";
import React from "react";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  `flex h-12 w-full rounded-lg border px-4 py-3 text-base transition-all duration-200
   file:border-0 file:bg-transparent file:text-sm file:font-medium
   placeholder:text-neutral-500 
   focus-visible:outline-none
   disabled:cursor-not-allowed disabled:opacity-50`,
  {
    variants: {
      variant: {
        default:
          "border-neutral-900 bg-neutral-1000 text-white hover:border-neutral-800 focus:border-blue-500/50",
        filled:
          "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-900 focus:bg-neutral-900 focus:border-blue-500/50",
        ghost:
          "border-transparent bg-transparent text-white hover:bg-neutral-1000 focus:bg-neutral-1000 focus:border-blue-500/50",
        outline:
          "border-2 border-neutral-900 bg-transparent text-white hover:border-neutral-800 focus:border-blue-500",
      },
      inputSize: {
        sm: "h-9 px-3 py-2 text-sm rounded-md",
        md: "h-12 px-4 py-3 text-base rounded-lg",
        lg: "h-14 px-5 py-4 text-lg rounded-xl",
      },
      error: {
        true: "border-error-500 focus:border-error-500 focus:ring-error-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      error: false,
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

/**
 * Input component with KONET-inspired styling
 *
 * Props:
 * - variant: default, filled, ghost, outline
 * - inputSize: sm, md, lg
 * - error: boolean to show error state
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, inputSize, error }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
export default Input;
