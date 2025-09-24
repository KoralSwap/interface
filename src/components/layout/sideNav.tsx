"use client";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

import reactor from "@/assets/reactor.svg";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideNav() {
  const router = useRouter();
  const [openModal, setOpen] = useState(false);
  return (
    <div className="flex items-center text-white lg:hidden">
      <Sheet open={openModal} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu className="cursor-pointer" size={30} />
        </SheetTrigger>
        <SheetContent side="left" className="border-none">
          <SheetTitle className="opacity-0 h-0">Navigationn</SheetTitle>
          <div className="py-6 flex justify-center">
            <button className="" role="link" onClick={() => router.push("/")}>
              <Image src={reactor} alt="" />
            </button>
          </div>
          <div className="flex justify-center">
            <nav className="space-y-4 text-center text-neutral-100">
              <ul
                aria-label="Core Navigation"
                className="space-y-4 rounded-md bg-primary/40 py-2 text-lg"
              >
                <li>
                  <Link onClick={() => setOpen(false)} href="/swap">
                    Swap
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/liquidity">
                    Liquidity
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/lock">
                    Lock
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/voting">
                    Vote
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/incentivize">
                    Incentivize
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
