import PageMarginContainer from "@/components/ui/pageMarginContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Headers from "@/components/ui/headers";
import React from "react";

export default function Loading() {
  return (
    <PageMarginContainer>
      <div className="flex justify-between">
        <div>
          <div>
            <Link
              href="/liquidity"
              className="flex text-[14px] gap-x-2 items-center"
            >
              <span>
                <ChevronLeft className="w-5 h-5" />
              </span>
              <span>All Pools</span>
            </Link>
          </div>
          <div className="pt-6"></div>
          <Headers.GradiantHeaderOne colorOne="#A0055D" colorTwo="#836EF9F2">
            Add liquidity
          </Headers.GradiantHeaderOne>
        </div>
      </div>
    </PageMarginContainer>
  );
}
