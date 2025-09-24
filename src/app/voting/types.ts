import { Address } from "viem";

export interface Allocations {
  [key: Address]: number;
}
