// GLOBAL TYPES
export type TPoolData = {
  account_gauge_balance: bigint;
  account_gauge_earned: bigint;
  account_lp_balance: bigint;
  account_token0_balance: bigint;
  account_token1_balance: bigint;
  bribe: string;
  claimable0: bigint;
  claimable1: bigint;
  decimals: bigint;
  emissions: bigint;
  emissions_token: string;
  emissions_token_decimals: bigint;
  fee: string;
  gauge: string;
  gauge_total_supply: bigint;
  name: string;
  pair_address: string;
  reserve0: bigint;
  reserve1: bigint;
  stable: boolean;
  symbol: string;
  token0: string;
  token0_decimals: bigint;
  token0_symbol: string;
  token1: string;
  token1_decimals: bigint;
  token1_symbol: string;
  total_supply: bigint;
};
import { isAddress } from "viem";
import { z } from "zod";
export enum ErrorMessage {
  INSUFFICIENT_BALANCE = "Insufficient Balance.",
  UNKNOWN_ERROR = "Unknown Error.",
}
export const TokenlistSchema = z.array(
  z
    .object({
      name: z.string(),
      symbol: z.string(),
      address: z.string().refine((arg) => isAddress(arg)),
      logoURI: z.nullable(
        z.union([z.string().url().min(1), z.string().base64().min(1)])
      ),
      decimals: z
        .number()
        .int()
        .max(2 ** 8),
      chainId: z.number().int(),
      import: z.optional(z.boolean()),
    })
    .strict()
);

export type TAddress = `0x${string}`;

export enum TPoolType {
  "CONCENTRATED",
  "STABLE",
  "VOLATILE",
}

export type TToken = z.infer<typeof TokenlistSchema.element>;

export enum SwapSteps {
  Wrap,
  Approve,
  Swap,
}
