import { atomWithStorage } from "jotai/utils";
import { createStore } from "jotai";
import { TToken } from "@/lib/types";

// Define your atoms
export const transactionDeadlineAtom = atomWithStorage(
  "transactionDeadline",
  10
);
export const annoucementModal = atomWithStorage("annoucementModal", true);
export const slippageAtom = atomWithStorage("slippage", 10);
export const multiHopsAtom = atomWithStorage("multiHops", false);
export const settingDialogOpenAtom = atomWithStorage("dialogOpen", false);
export const inviteCodeAtom = atomWithStorage("inviteCode", "");
export const importedTokensAtom = atomWithStorage<TToken[]>(
  "importedTokens",
  []
);
export const store = createStore();
