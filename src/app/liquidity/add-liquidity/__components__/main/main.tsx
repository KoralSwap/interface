"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { isAddress } from "viem";
import AddLiquidityV2 from "./addLiquidityV2";

const searchParamsSchema = z.object({
  token0: z.string().refine((arg) => isAddress(arg)),
  token1: z.string().refine((arg) => isAddress(arg)),
  version: z.enum(["stable", "volatile"]),
});

export default function LiquidityCard() {
  const params = useSearchParams();
  const { token0, token1, version } = useMemo(() => {
    const token0 = params.get("token0");
    const token1 = params.get("token1");
    const version = params.get("version");
    const param = { token0, token1, version };
    const afterParse = searchParamsSchema.safeParse(param);
    return afterParse.success
      ? {
          token0: afterParse.data.token0,
          token1: afterParse.data.token1,
          version: afterParse.data.version,
        }
      : {
          token0: undefined,
          token1: undefined,
          version: undefined,
        };
  }, [params]);

  return !token0 || !token1 ? undefined : (
    <>
      {(version === "stable" || version === "volatile") && <AddLiquidityV2 />}
    </>
  );
}
