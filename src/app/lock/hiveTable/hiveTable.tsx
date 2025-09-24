import React from "react";
import HiveRow from "./hiveRow";

export default function HiveTable() {
  return (
    <table className="w-full pt-6">
      <caption className="h-0 opacity-0">Hive Table</caption>
      <thead>
        <tr className="grid grid-cols-8 px-6 py-2 font-medium text-neutral-400 text-sm">
          <th className="col-span-4 text-left">Hive name</th>
          <th>APR</th>
          <th>Reward</th>
          <th>Voting Power</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="">
        <HiveRow />
        <HiveRow />
        <HiveRow />
      </tbody>
    </table>
  );
}
