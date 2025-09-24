import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-block  items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors" +
    " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 hover:bg-primary-400 text-white disabled:data-[pending=true]:bg-neutral-900 disabled:data-[pending=true]:text-neutral-100  disabled:text-neutral-300 disabled:bg-neutral-95 active:data-[pending=true]:bg-primary-400/50 active:data-[pending=true]:text-neutral-100  active:text-neutral-300 active:bg-neutral-95",
        outline:
          "border border-neutral-900 text-neutral-100 hover:bg-neutral-900",
        filled:
          "border border-neutral-950 text-white hover:bg-neutral-950 bg-neutral-1000",
      },
      size: {
        sm: "py-xxs px-sm rounded-md  text-[12px] leading-[16px] font-medium",
        xs: "py-xs px-xxs rounded-sm  text-[12px] leading-[12px] font-medium",
        xss: "py-[2px] px-xs rounded-sm  text-[12px] leading-[12px] font-medium",
        md: "px-4 rounded-md text-md leading-[20px] py-[10px]",
        submit: "py-3 w-full text-[16px] 2xl:text-[18px]  ",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
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
 * - `variant` (string): Defines the visual style of the button. Options are:
 * - `size` (string): Defines the size of the button. Options are:
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
