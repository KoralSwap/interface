import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200" +
    " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background" +
    " disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-primary text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-100" +
          " disabled:bg-neutral-900 disabled:text-neutral-500 disabled:shadow-none",
        secondary:
          "bg-neutral-1000 text-white border border-neutral-900 hover:bg-neutral-950 hover:border-blue-500/50" +
          " active:bg-neutral-900",
        outline:
          "border-2 border-neutral-900 text-neutral-100 bg-transparent hover:bg-neutral-1000 hover:border-blue-500/50" +
          " active:bg-neutral-950",
        filled:
          "border border-neutral-950 text-white hover:bg-neutral-950 bg-neutral-1000 hover:border-neutral-900" +
          " active:bg-neutral-900",
        ghost:
          "text-neutral-300 hover:bg-neutral-1000 hover:text-white active:bg-neutral-950",
        gradient:
          "bg-gradient-accent text-white shadow-md shadow-cyan-400/20 hover:shadow-lg hover:shadow-cyan-400/30 hover:scale-105 active:scale-100",
        destructive:
          "bg-error-500 text-white hover:bg-error-600 shadow-md shadow-error-500/20 hover:shadow-lg hover:shadow-error-500/30",
        success:
          "bg-success-500 text-white hover:bg-success-600 shadow-md shadow-success-500/20 hover:shadow-lg hover:shadow-success-500/30",
      },
      size: {
        xs: "h-8 px-3 py-2 text-xs rounded-md",
        sm: "h-10 px-4 py-2.5 text-sm rounded-md",
        md: "h-11 px-5 py-3 text-sm rounded-lg",
        lg: "h-12 px-7 py-3.5 text-base rounded-lg",
        xl: "h-14 px-9 py-4 text-lg rounded-xl",
        icon: "h-10 w-10 p-2 rounded-lg",
        "icon-sm": "h-8 w-8 p-1.5 rounded-md",
        "icon-lg": "h-12 w-12 p-3 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * `Button` is a reusable React component that renders a button element with customizable styles and behavior.
 *
 * Style Props:
 * - `className` (string): Additional custom class names to apply to the button.
 * - `variant` (string): Defines the visual style of the button. Options: primary, secondary, outline, filled, ghost, gradient, destructive, success
 * - `size` (string): Defines the size of the button. Options: xs, sm, md, lg, xl, icon, icon-sm, icon-lg
 * - `asChild` (boolean): If true, the button will be rendered as its child element (useful for Link components)
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
