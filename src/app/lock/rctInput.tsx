import Input, { InputProps } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import symbl from "@/assets/reactor-symbol.svg";
import { inputPatternMatch } from "@/lib/utils";

export default function RctInput(props: InputProps) {
  return (
    <div className=" focus-within:ring-1 ring-neutral-200 rounded-md bg-neutral-950 border-neutral-900 flex border-[1px]  px-4 w-full">
      <div className="border-r-[1px] gap-x-1 flex border-neutral-900 py-2 pr-4">
        <Image src={symbl} width={24} height={24} alt="Reactor Ticker" />
        <h2>RCT</h2>
      </div>
      <Input
        {...props}
        onChange={(e) => {
          if (props.onChange) {
            inputPatternMatch(e.target.value, 18);
            props?.onChange?.(e);
          }
        }}
        ring="none"
        className="border-none peer bg-transparent flex-grow"
      />
    </div>
  );
}
