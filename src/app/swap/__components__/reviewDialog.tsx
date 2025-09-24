"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";

export default function ReviewDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        className="inline-flex"
        size="md"
        variant="outline"
      >
        Review
      </Button>
      <DialogContent className=" w-[450px]">
        <DialogTitle className="text-[16px] text-white font-normal text-center">
          Review Swap
        </DialogTitle>
        <div className="space-y-6">
          <TokenSwap />
          <TokenSwap />
          <div className="border-t border-neutral-700"></div>
          <div className="space-y-2 ">
            <Row />
            <Row />
            <Row />
            <Row />
          </div>
        </div>
        <Button
          onClick={() => setOpen(false)}
          variant={"primary"}
          size="submit"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
function Row() {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-neutral-400">Exchange Rate</span>
      <span className="">1 RCT = 0.7 MON</span>
    </div>
  );
}
function TokenSwap() {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <div className="text-sm text-neutral-400">You pay</div>
        <div className="text-[30px]">1 MON</div>
        <div className="text-sm text-neutral-400">You pay</div>
      </div>
      <div>
        <div className="h-10 w-10 bg-blue-400 rounded-full"></div>
      </div>
    </div>
  );
}
