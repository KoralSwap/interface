import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import numeral from "numeral";
import { ChainId, ETHER, WETH } from "@/data/constants";
import { Address } from "viem";

export function wmonToMon(addr: Address) {
  if (addr.toLowerCase() === WETH[ChainId.MONAD_TESTNET].toLowerCase()) {
    return ETHER.toLowerCase() as Address;
  } else {
    return addr;
  }
}
export const enum ErrorCodes {
  InsufficientBalance = "Insufficient balance",
  EnterAmount = "Enter amount",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @returns string | Will round down to 10th decimal
 */
export function formatNumber(number: number | string, decimals = 3): string {
  if (typeof number === "string") {
    number = Number.parseFloat(number);
    if (!Number.isFinite(number)) {
      return "0";
    }
  }

  let n = number;
  // round down

  if (number >= 1 && number <= 999) {
    const parts = n.toString().split(".");
    if (!parts[0]) {
      return "0";
    }
    // show only three most sign digits
    const sig = 3 - parts[0].length;
    return Number.parseFloat(
      `${parts[0]}.${parts[1]?.slice(0, sig)}`
    ).toString();
  }

  if (n === 0) {
    return "0";
  }
  if (n < 1 && n >= 0.001) {
    const parts = n.toString().split(".");
    // return trimToSignificantDigits(n).toString();
    let zeros = 0;
    if (parts[1]?.split("")) {
      for (const digit of parts[1]?.split("")) {
        if (digit === "0") {
          zeros++;
        } else {
          // break once you hit a number other then 0
          break;
        }
      }
    }
    return Number.parseFloat(
      `0.${parts[1]?.slice(0, decimals + zeros)}`
    ).toString();
  }
  if (n < 0.001) {
    return formatSmallNumber(n);
    // const factor = Math.pow(10, 10);
    // const roundedDown = Math.floor(n * factor) / factor;
    // return roundedDown.toExponential();
  }
  if (n > 999) {
    const num = numeral(n);
    const f = num.format("0.000a").toUpperCase();
    const parts = f.split(".");

    if (!parts[0]) {
      return "0";
    }
    // show only three most sign digits
    const sig = 3 - parts[0].length;

    return (
      Number.parseFloat(`${parts[0]}.${parts[1]?.slice(0, sig)}`).toString() +
      `${f[f.length - 1]}`
    );
  }
  if (decimals) {
    n = roundDown(n, 10);
  }

  return n.toString();
}
export function formatSmallNumber(number: number) {
  const num = number.toString();
  if (num.includes("e")) {
    // number is in scientific notation
    const sige = parseInt(num.split("e")[1] ?? "0");
    const nums = parseInt(
      num.split("e")[0]?.replace(".", "").slice(0, 3) ?? "0"
    );
    const result = "0.0" + `v${Math.abs(sige).toString()}` + nums;
    return result;
  }
  const decimalPart = num.split(".")[1];
  if (decimalPart === undefined) {
    return "0";
  }
  let zeros = 0;
  for (const i of decimalPart) {
    if (i === "0") {
      zeros++;
    }
    if (i !== "0") {
      break;
    }
  }
  const sig = decimalPart.slice(zeros, zeros + 3);
  const result = "0.0" + `v${zeros.toString()}` + sig;
  return result;
}
/**
 * inputPatternMatch
 * Ensures value is a number
 */
export function inputPatternMatch(s: string, decimals = 18) {
  const pattern = /^[0-9]*[.,]?[0-9]*$/;
  const decimalPattern = RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);
  if (s === "") {
    return true;
  }
  if (pattern.test(s) && decimalPattern.test(s)) return true;
  return false;
}

export function roundDown(float: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  const roundedDown = Math.floor(float * factor) / factor;
  return roundedDown;
}
