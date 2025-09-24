import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { Input } from "../ui/input";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import ImageWithFallback from "./imageWithFallback";
import { inputPatternNumberMatch } from "@/utils";
import { TToken } from "@/lib/types";

/**
 * Must Wrap in Form Field
 */
function NumberInput<T extends FieldValues>({
  disabled,
  onChangeValue,
  decimals,
  value,
}: {
  disabled: boolean;
  decimals: number;
  onChangeValue?: (value: string) => void;
  field?: ControllerRenderProps<T>;
  value?: string | number;
}) {
  return (
    <Input
      className="w-[60%] border-none bg-neutral-950"
      disabled={disabled}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder="0"
      minLength={1}
      step="any"
      value={value}
      onChange={(e) => {
        if (
          inputPatternNumberMatch(e.target.value, decimals) &&
          onChangeValue
        ) {
          return onChangeValue(e.target.value);
        }
      }}
    />
  );
}

function Root({
  children,
  title,
  estimate,
}: {
  title: string;
  estimate: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1 ">
      <h4 className="text-sm text-neutral-300">{title}</h4>
      <div className="flex w-full">{children}</div>
      <h4 className="text-right text-sm text-neutral-300">~{estimate}</h4>
    </div>
  );
}
function CurrencySelect({
  token,
  ...buttonProps
}: {
  token: TToken | null;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...buttonProps}
      className="w-[50%] bg-neutral-950 items-center flex justify-between border rounded-[2px] px-4  border-neutral-900"
    >
      <div className="flex items-center gap-x-2 text-sm ">
        {token !== null && (
          <>
            <ImageWithFallback
              src={token.logoURI}
              width={25}
              height={25}
              className="h-6 w-6 rounded-full"
              alt="alt"
            />
            {token.symbol}
          </>
        )}
        {token === null && (
          <span className="text-[12px] font-medium text-nowrap">
            Select Token
          </span>
        )}
      </div>
      <ChevronDown className="text-neutral-500" />
    </button>
  );
}

const CurrencyInput = {
  Root,
  CurrencySelect,
  NumberInput,
};
export default CurrencyInput;
