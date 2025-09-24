import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

export default function TransactionCard() {
  return (
    <Card className="">
      <Tabs defaultValue="transaction">
        <TabsList colors="transparent">
          <TabsTrigger
            className="rounded-b-none rounded-tr-none"
            value="transaction"
          >
            Transaction
          </TabsTrigger>
          <TabsTrigger className="rounded-none" value="limits">
            Limits
          </TabsTrigger>
          <TabsTrigger className="rounded-none" value="liquidity">
            Liquidity
          </TabsTrigger>
          <TabsTrigger className="rounded-none" value="info">
            Info
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transaction">
          <div className="border-t border-neutral-800">
            <table className="w-full">
              <caption className="h-0 overflow-hidden">Test</caption>
              <TransactionTableHeaders />
              <tbody>
                <TransactionTableRow />
                <TransactionTableRow />
                <TransactionTableRow />
                <TransactionTableRow />
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function TransactionTableHeaders() {
  return (
    <thead>
      <tr className="grid grid-cols-13 p-4 w-full font-normal text-neutral-600 text-sm">
        <th className="col-span-2 text-left">Date</th>
        <th className="col-span-2 text-left">Transaction id</th>
        <th className="col-span-2 text-left">Wallet</th>
        <th className="text-left">Side</th>
        <th>Type</th>
        <th>Price</th>
        <th>Value</th>
        <th>ETH</th>
        <th>USDC</th>
        <th>TXN</th>
      </tr>
    </thead>
  );
}
function TransactionTableRow() {
  return (
    <tr className="grid grid-cols-13 items-center text-sm py-2 px-4 text-center">
      <td className="col-span-2 text-left text-neutral-100">
        Dec 26 03:52:59 PM
      </td>
      <td className="col-span-2 text-left text-neutral-200">
        0x35f013528x8721…
      </td>
      <td className="col-span-2 text-left text-neutral-200">0x5ffb6…22e1</td>
      <td className="text-success-400 text-left">Buy</td>
      <td className="text-success-400">Market</td>
      <td className="text-error-400">0.0180</td>
      <td className="text-neutral-300"> $3,400.00</td>

      <td className="flex gap-x-1 items-center justify-center">
        <Image width={20} height={20} className="h-5 w-5" src={""} alt="USDC" />
        0.1
      </td>
      <td className="flex gap-x-1 items-center justify-center">
        <Image width={20} height={20} className="h-5 w-5" src={""} alt="USDC" />
        134.01
      </td>
      <td>^</td>
    </tr>
  );
}
