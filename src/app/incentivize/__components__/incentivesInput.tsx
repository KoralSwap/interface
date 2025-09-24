import Input, { InputProps } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { inputPatternMatch } from "@/lib/utils";
import { TToken } from "@/lib/types";

export default function IncentivesInput({
  token,
  onButtonClick,
  ...props
}: InputProps & { token?: TToken; onButtonClick?: () => void }) {
  return (
    <div className=" focus-within:ring-1  ring-neutral-200 rounded-md bg-neutral-950 border-neutral-900 flex border-[1px]  px-4">
      <button
        onClick={onButtonClick}
        className="border-r-[1px] gap-x-1 flex items-center border-neutral-900 py-2 pr-4"
      >
        {token ? (
          <>
            <Image
              src={token?.logoURI ?? ""}
              width={24}
              height={24}
              alt={token.symbol}
              className="rounded-full"
            />
            <h2>{token?.symbol}</h2>
          </>
        ) : (
          <span className="text-sm  ">Select token</span>
        )}
      </button>
      <Input
        {...props}
        onChange={(e) => {
          if (props.onChange) {
            inputPatternMatch(e.target.value, 18);
            props?.onChange?.(e);
          }
        }}
        ring="none"
        className="border-none peer w-[200px] bg-transparent flex-grow"
      />
    </div>
  );
}
