import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import Image from "next/image";

import symbl from "@/assets/reactor-symbol.svg";
import {
  SelectItemProps,
  SelectProps,
  SelectTriggerProps,
} from "@radix-ui/react-select";

function Root(props: SelectProps) {
  return <Select {...props} />;
}
function Trigger({ children, ...props }: SelectTriggerProps) {
  return (
    <SelectTrigger {...props}>
      <div className="flex justify-center items-center gap-x-2 ">
        <Image src={symbl} width={24} height={24} alt="Reactor Ticker" />
        <SelectValue>{children}</SelectValue>
      </div>
    </SelectTrigger>
  );
}
function SelectList({ children }: { children: React.ReactNode }) {
  return (
    <SelectContent>
      <SelectGroup>{children}</SelectGroup>
    </SelectContent>
  );
}
function Item(props: SelectItemProps) {
  return <SelectItem {...props}></SelectItem>;
}
const LockDropdown = { Root, Trigger, SelectList, Item };
export default LockDropdown;
