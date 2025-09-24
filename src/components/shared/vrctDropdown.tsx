import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import Image from "next/image";

import symbl from "@/assets/reactor-symbol.svg";

export default function VrctDropdown({
  placeholder,
  children,
}: {
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <Select>
      <SelectTrigger className="flex  py-2">
        <div className="flex justify-center items-center gap-x-2 ">
          <Image src={symbl} width={24} height={24} alt="Reactor Ticker" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  );
}
