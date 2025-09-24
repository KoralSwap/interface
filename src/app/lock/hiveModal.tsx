"use client";
import wheel from "@/assets/wheel.svg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function HiveDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(!open)} variant={"outline"} size="sm">
        Claim Lock
      </Button>
      <DialogContent className="px-0">
        <div className="border-b border-neutral-700 px-4 pb-4">
          <DialogTitle className="text-[20px]">Deposit Lock</DialogTitle>

          <h3 className="text-neutral-400 text-sm">
            Deposit through hive strategies
          </h3>
        </div>
        <div className="px-4 space-y-4">
          <div className="flex justify-between">
            <button className="font-medium">Select a lock</button>
            <button className="text-blue-light text-sm">
              Create a new lock
            </button>
          </div>
          {/* <LockDropdown placeholder="RCT"> */}
          {/*   <SelectItem value="a"></SelectItem> */}
          {/* </LockDropdown> */}
          <h4 className="text-neutral-600">Hive Strategy</h4>
          <div className="border-t border-neutral-800"></div>
          <div className="flex gap-x-2">
            <div className="w-[48px] h-[48px] rounded-[8px] bg-neutral-950 flex items-center justify-center">
              <Image src={wheel} alt="hive" className="w-7 h-7" />
            </div>
            <div className="">
              <div className="flex gap-x-2">
                <span>veRCT Maxi</span>
                <Badge colors={"neutral"}>ID 1234</Badge>
              </div>
              <span className="text-neutral-700 text-[13px]">
                Updated 5 days ago 0x1232
              </span>
            </div>
          </div>
          <div className="flex rounded-md gap-x-2 bg-neutral-950 border border-neutral-800 p-4">
            <Checkbox></Checkbox>
            <div>
              <p className="text-neutral-300 text-sm leading-[18px]">
                I understand that by depositing my Lock into a Hive strategy,
                the Lock unlock date will be extended to 4 years.
              </p>
            </div>
          </div>
          <Button variant={"primary"} size="submit">
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
