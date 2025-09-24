"use client";
import React from "react";
import Spinner from "./ui/spinner";

export default function TransactionSpinner({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (!isLoading) return;
  return (
    <div className="fixed z-[100] right-[34px] top-[74px]">
      <Spinner />
    </div>
  );
}
