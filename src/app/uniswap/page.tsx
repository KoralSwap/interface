"use client";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useEthSwap } from "./useEthSwap";
import { TAddress } from "@/lib/types";
import { useWethDeposit } from "./useWeth";
import { parseUnits } from "viem";
import { Contracts } from "@/lib/contracts";
import { TarpAbi } from "@/lib/abis/Tarp";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [formData, setFormData] = useState({ token: "", deposit: "" });
  const { writeContract, reset, data: hash } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    if (isSuccess) {
      setFormData({ token: "", deposit: "" });
      reset();
    }
  }, [isSuccess, reset]);
  const { data } = useEthSwap({
    deposit: formData.deposit,
    token: formData.token as TAddress,
  });
  const onSubmit = () => {
    if (data?.request) {
      writeContract(data?.request);
    }
  };
  const { address } = useAccount();
  const { data: mintRct } = useSimulateContract({
    ...Contracts.Reactor,
    functionName: "mintRct",
    args: [address ?? "0x", parseUnits("1000", 18)],
  });
  const { data: mintTarp } = useSimulateContract({
    abi: TarpAbi,
    address: "0xf08ae37182DA7a094087f3255Fa1915fa4490483",
    functionName: "mint",
    args: [address ?? "0x", parseUnits("1000", 18)],
  });
  const { data: mintVoot } = useSimulateContract({
    abi: TarpAbi,
    address: "0x1EF97B4c3Fa0b5aFB1727D9598027257944390F7",
    functionName: "mint",
    args: [address ?? "0x", parseUnits("1000", 18)],
  });
  const { data: getWeth } = useWethDeposit({ amount: parseUnits("1", 18) });
  const onSubmit2 = () => {
    if (getWeth?.request) writeContract(getWeth?.request);
  };
  const onSubmit3 = () => {
    if (mintRct?.request) writeContract(mintRct?.request);
  };
  const onSubmit4 = () => {
    if (mintTarp?.request) writeContract(mintTarp?.request);
  };
  const onSubmit5 = () => {
    if (mintVoot?.request) writeContract(mintVoot?.request);
  };
  return (
    <div className="flex justify-center">
      <div className="p-4 border rounded shadow-md w-80">
        <div className="mb-4">
          <label className="block text-sm font-medium">Token</label>
          <input
            type="text"
            name="token"
            value={formData.token}
            onChange={(e) => {
              setFormData((d) => {
                return { ...d, token: e.target.value };
              });
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">deposit</label>
          <input
            type="deposit"
            name="deposit"
            value={formData.deposit}
            onChange={(e) => {
              setFormData((d) => {
                return { ...d, deposit: e.target.value };
              });
            }}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!Boolean(data?.request)}
          type="button"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
        >
          Submit
        </button>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onSubmit2}>Get WETH</Button>
          <Button onClick={onSubmit3}>Get RCT</Button>
          <Button onClick={onSubmit4}>Mint Tarp</Button>
          <Button onClick={onSubmit5}>Mint Voot</Button>
        </div>
      </div>
    </div>
  );
}
