"use client";
import React, { ReactNode, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchParamsSchema } from "../types";
import { convertToPoolType } from "../utils";
import LiquidityCard from "./main/main";

export default function LiquidityCardWrapper() {
  const params = useSearchParams();
  const { poolType } = useMemo(() => {
    const version = params.get("version");
    const param = { version };

    const payload = searchParamsSchema.safeParse(param);
    return payload.success
      ? {
          poolType: convertToPoolType(payload.data.version),
        }
      : {
          poolType: undefined,
        };
  }, [params]);
  if (poolType === undefined) return <Wrapper></Wrapper>;
  return <Wrapper>{poolType !== undefined && <LiquidityCard />}</Wrapper>;
}

function Wrapper({ children }: { children?: ReactNode }) {
  return <div className="flex justify-center w-full">{children}</div>;
}
