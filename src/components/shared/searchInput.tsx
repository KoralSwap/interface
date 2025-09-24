"use client";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
interface Props {
  value: string;
  setValue?: (s: string) => void;
  className?: string;
}
export default function SearchInput({ value, setValue, className }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      data-focused={isFocused ? "focused" : "not-focused"}
      className={
        "flex gap-x-3 bg-neutral-950 h-[42px] rounded-md p-2 outline-1 data-[focused=focused]:outline data-[focused=focused]:outline-white " +
        className
      }
    >
      <div className="flex items-center">
        <Search
          data-focused={isFocused ? "focused" : "not-focused"}
          className="data-[focused=focused]:text-white text-neutral-400 h-5 w-5"
        />
      </div>
      <input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="text"
        onChange={(e) => setValue?.(e.target.value)}
        value={value}
        className="w-full  placeholder:text-sm bg-transparent placeholder:text-neutral-400 focus:outline-none"
        placeholder="Search by name, symbol or address"
      />
      {value !== "" && (
        <button onClick={() => setValue?.("")}>
          <X className="text-gray-400" />
        </button>
      )}
    </div>
  );
}
