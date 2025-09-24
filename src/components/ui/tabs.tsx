"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const Tabs = TabsPrimitive.Root;
// Define the `cva` function for styling variants
const tabsListVariants = cva(
  "items-center justify-center flex bg-transparent rounded-md text-muted-foreground", // Base styles
  {
    variants: {
      gap: {
        gap1: "gap-x-1",
      },
      size: {
        sm: "",
        md: "",
      },
      border: {
        none: "",
        "border-1": "border border-[#43444C]",
      },
      colors: {
        transparent: "",
        muted: "bg-neutral-1000",
      },
      display: {
        grow: "flex",
        default: "inline-flex",
      },
    },
    defaultVariants: {
      size: "md",
      display: "default",
    },
  }
);
interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

/**
 * `TabsList` is a wrapper component for `TabsPrimitive.List` that allows customization
 * of styles and behavior through props such as `size`, `display`, `colors`, and `border`.
 * It uses `React.forwardRef` to pass down the ref to the underlying `TabsPrimitive.List` component.
 *
 * @param {Object} props - The props for the `TabsList` component.
 * @param {string} [props.className] - Additional class names to apply to the component.
 * @param {string} [props.size] - The size variant of the tabs list.
 * @param {string} [props.display] - The display variant of the tabs list.
 * @param {string} [props.colors] - The color variant of the tabs list.
 * @param {string} [props.border] - The border variant of the tabs list.
 * @param {React.Ref} ref - The ref to be forwarded to the `TabsPrimitive.List` component.
 *
 * @returns {JSX.Element} The rendered `TabsList` component.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, size, gap, display, colors, border, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      tabsListVariants({ size, gap, colors, border, display, className })
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  `inline-flex items-center  justify-center whitespace-nowrap rounded-sm px-2 md:px-3
    py-1.5 text-sm font-medium ring-offset-background transition-all
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
    focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
     data-[state=active]:shadow-sm`,
  {
    variants: {
      display: {
        grow: "flex-grow",
        default: "",
      },
      colors: {
        primary:
          "data-[state=active]:bg-neutral-950 data-[state=active]:text-white text-neutral-400",
        white: "data-[state=active]:text-white text-neutral-400",
      },
      border: {
        none: "",
        "primary-1":
          "border-b rounded-none border-neutral-900 data-[state=active]:border-primary-400",
      },
    },
    defaultVariants: {
      display: "default",
      colors: "primary",
      border: "none",
    },
  }
);
interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, display, colors, border, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      tabsTriggerVariants({
        display,
        colors,
        border,
        className,
      })
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
