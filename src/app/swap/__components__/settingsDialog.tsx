"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inputPatternMatch } from "@/lib/utils";
import {
  settingDialogOpenAtom,
  slippageAtom,
  transactionDeadlineAtom,
} from "@/store";
import { inputPatternNumberMatch } from "@/utils";
import { useAtom } from "jotai";
import { Settings } from "lucide-react";
import React, { useCallback, useState } from "react";

type State = {
  deadlineFocus: boolean;
  slippageFocus: boolean;
};

export default function SettingsDialog({
  dontShowButton,
}: {
  dontShowButton?: boolean;
}) {
  const [deadline, updateDeadline] = useAtom(transactionDeadlineAtom);
  const [slippage, updateSlippage] = useAtom(slippageAtom);
  const [dialogOpen, setDialogOpen] = useAtom(settingDialogOpenAtom);
  const [, setInputState] = useState<State>({
    deadlineFocus: false,
    slippageFocus: false,
  });
  const updateState = useCallback(
    (payload: Partial<State>) => {
      setInputState((prevState) => ({ ...prevState, ...payload }));
    },
    [setInputState]
  );
  // useEffect(() => {
  //   if (dialogOpen) {
  //     updateState({
  //       slippageInput: (slippage / 100).toString(),
  //       deadlineInput: deadline.toString(),
  //     });
  //   }
  // }, [deadline, dialogOpen, slippage, updateState]);
  // useEffect(() => {
  //   if (!inputState.slippageFocus) {
  //     updateState({ slippageInput: (slippage / 100).toString() });
  //   }
  // }, [updateSlippage, slippage, inputState.slippageFocus, updateState]);
  // useEffect(() => {
  //   if (!inputState.deadlineFocus) {
  //     updateState({ deadlineInput: deadline.toString() });
  //   }
  // }, [updateSlippage, updateState, inputState.deadlineFocus, deadline]);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!dontShowButton && (
        <button
          className="bg-neutral-950 p-1 rounded-full flex items-center gap-x-2"
          onClick={() => setDialogOpen(true)}
        >
          <div className="bg-neutral-900 rounded-full text-sm text-neutral-400 px-2 py-1">
            {slippage / 100}% Slippage
          </div>
          <Settings className="text-neutral-400" />
        </button>
      )}
      <DialogContent className="p-0 w-[350px] md:w-[400px]">
        <div className="pt-4 px-4">
          <DialogTitle className="text-lg">Settings</DialogTitle>
        </div>
        <div className="border-t border-neutral-700 p-2 md:p-4 space-y-6 ">
          <div className="space-y-2">
            <h3 className="text-sm">Slippage Tolerance</h3>
            <div className="flex gap-x-2">
              <div className="w-full">
                <Tabs defaultValue="swap" value={slippage.toString()}>
                  <TabsList
                    border={"border-1"}
                    size="sm"
                    colors="muted"
                    display={"grow"}
                  >
                    <TabsTrigger
                      onClick={() => {
                        updateSlippage(10);
                      }}
                      display={"grow"}
                      value="10"
                    >
                      0.1%
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => {
                        updateSlippage(50);
                      }}
                      display={"grow"}
                      value="50"
                    >
                      0.5%
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => {
                        updateSlippage(100);
                      }}
                      display={"grow"}
                      value="100"
                    >
                      1%
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="bg-neutral-950  flex gap-x-1 items-center rounded-md">
                <Input
                  min={1}
                  max={100}
                  type="number"
                  placeholder="Custom"
                  variant="transparent"
                  onFocus={() => updateState({ slippageFocus: true })}
                  onBlur={() => updateState({ slippageFocus: false })}
                  onChange={(e) => {
                    if (!inputPatternMatch(e.target.value)) return;
                    const newSlippage = Number(e.target.value) * 100;
                    updateSlippage(newSlippage);
                  }}
                  value={String(slippage / 100)}
                  className="w-20 bg-neutral-900/50 px-2 h-[32px]"
                />
                <span className="px-1">%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm">Transaction Deadline</h3>
            <div className="bg-neutral-1000 px-2 items-center flex justify-end border-neutral-900 border  rounded-md">
              <Input
                min={1}
                max={400}
                type="number"
                onFocus={() => updateState({ deadlineFocus: true })}
                onBlur={() => updateState({ deadlineFocus: false })}
                className="w-full !bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                dir="rtl"
                variant="ghost"
                onChange={(e) => {
                  if (!inputPatternNumberMatch(e.target.value)) return;
                  updateDeadline(Number(e.target.value));
                }}
                value={String(deadline)}
              />
              <span className="text-neutral-200">minutes</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
