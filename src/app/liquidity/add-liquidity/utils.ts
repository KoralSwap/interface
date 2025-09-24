import { TPoolType } from "@/lib/types";

export function convertToPoolType(version: string) {
  switch (version) {
    case "stable":
      return TPoolType.STABLE;
    case "volatile":
      return TPoolType.VOLATILE;
    case "concentrated":
      return TPoolType.CONCENTRATED;
  }
}
