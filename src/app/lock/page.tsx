"use client";
import React from "react";
import Headers from "@/components/ui/headers";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import CreateLockDialog from "./createLockDialog/createLockDialog";
import LockTable from "./lockTable/lockTable";
import ClaimAllLocks from "./claimAllLocks";

export default function Lock() {
  return (
    <div>
      <PageMarginContainer>
        <div className="flex justify-between">
          <div className="w-[600px] lg:w-[640px]">
            <div className="">
              <Headers.GradiantHeaderOne
                colorOne="#A0055D"
                colorTwo="#836EF9F2"
              >
                Lock
              </Headers.GradiantHeaderOne>
            </div>
            <h2 className="text-neutral-300 pt-6 text-[13px]">
              Lock RCT into veRCT to earn and govern. Vote with veRCT to earn
              bribes and trading fees. veRCT can be transferred, merged and
              split. You can hold multiple positions.
            </h2>
          </div>
          <div>
            <CreateLockDialog />
          </div>
        </div>
        <div className="flex justify-between pt-12">
          <Headers.InfoHeaderTwo popupContent={<div></div>}>
            Locks
          </Headers.InfoHeaderTwo>

          <ClaimAllLocks />
        </div>
        <div className="pt-6"></div>
        <div>
          <LockTable />
        </div>
        {/* <div className="pt-16"></div> */}
        {/* <Headers.InfoHeaderTwo popupContent={<div></div>}> */}
        {/*   Hive */}
        {/* </Headers.InfoHeaderTwo> */}
        {/* <HiveTable /> */}
      </PageMarginContainer>
    </div>
  );
}
