import React from "react";
import HiveModal from "../hiveModal";

export default function HiveRow() {
  return (
    <>
      <tr className="grid text-center rounded-sm grid-cols-8 items-center bg-neutral-1000 py-2 px-6">
        <td className="col-span-4 text-left">veRCT Maxi</td>
        <td>11.22</td>
        <td>11.22</td>
        <td>11.22</td>
        <td className="flex justify-end">
          <HiveModal />
        </td>
      </tr>
      <tr className="flex justify-between items-center mx-2 mb-2 border-neutral-1000 py-2 px-4 border-[6px] rounded-b-md ">
        <LockedColumnStat title="Deposited Lock #" value="Lock #007" />

        <LockedColumnStat title="Deposited" value="3000" />

        <LockedColumnStat title="Rewards" value="999,99.00" />
        <td className="flex justify-end text-sm">
          <button
            disabled
            className="text-primary-400 hover:text-primary-200 disabled:hover:text-neutral-400 disabled:text-neutral-400"
          >
            Withdraw
          </button>
        </td>
      </tr>
    </>
  );
}
function LockedColumnStat({ title, value }: { title: string; value: string }) {
  return (
    <td className="text-sm">
      <div>
        <span className="text-neutral-400 text-sm">{title}</span>
      </div>
      <div>
        <span className="font-medium text-sm">{value}</span>
      </div>
    </td>
  );
}
