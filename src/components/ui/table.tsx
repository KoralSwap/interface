import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { forwardRef } from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return <table>{children}</table>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="text-neutral-400 text-sm text-right w-full">
      <tr className=" grid grid-cols-11 gap-x-4 px-4">{children}</tr>
    </thead>
  );
}

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return (
    <tbody ref={ref} className="gap-y-2 pt-2 flex flex-col">
      {children}
    </tbody>
  );
});
TableBody.displayName = "TableBody";

const tableVariants = cva(
  "grid hover:border-[#43444C] border transition-colors border-transparent items-center group text-sm text-right gap-x-4 py-[10px] bg-neutral-1000 px-4 rounded-md",
  {
    variants: {
      cols: {
        "11": "lg:grid-cols-11",
        "10": "lg:grid-cols-10",
        "9": "lg:grid-cols-9",
        "8": "lg:grid-cols-8",
        "7": "lg:grid-cols-7",
        "6": "lg:grid-cols-6",
        "5": "lg:grid-cols-5",
        "4": "lg:grid-cols-4",
        "3": "lg:grid-cols-3",
        "2": "lg:grid-cols-2",
      },
      mobileCols: {
        "11": "grid-cols-11",
        "10": "grid-cols-10",
        "9": "grid-cols-9",
        "8": "grid-cols-8",
        "7": "grid-cols-7",
        "6": "grid-cols-6",
        "5": "grid-cols-5",
        "4": "grid-cols-4",
        "3": "grid-cols-3",
        "2": "grid-cols-2",
      },
    },
    defaultVariants: { cols: "11", mobileCols: "11" },
  }
);
interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableVariants> {}
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, cols, mobileCols, className }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(tableVariants({ cols, mobileCols, className }))}
      >
        {children}
      </tr>
    );
  }
);
TableRow.displayName = "TableRow";
