"use client";

import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [openModal, setOpen] = useState(false);

  const navLinks = [
    { href: "/swap", label: "Swap" },
    { href: "/liquidity", label: "Liquidity" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <div className="flex items-center text-white lg:hidden">
      <Sheet open={openModal} onOpenChange={setOpen}>
        <SheetTrigger className="rounded-lg p-2 transition-colors hover:bg-neutral-900">
          <Menu className="cursor-pointer" size={24} />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] border-neutral-900 bg-neutral-1000/95 backdrop-blur-xl"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Logo */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-6">
            <button
              className="transition-transform hover:scale-105"
              role="link"
              onClick={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              <span className="text-lg font-bold text-gradient">KoralSwap</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname.includes(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      onClick={() => setOpen(false)}
                      href={link.href}
                      className={`
                        flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-primary text-white shadow-lg shadow-blue-500/20"
                            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Info */}
          <div className="absolute bottom-8 left-6 right-6">
            <div className="rounded-lg border border-neutral-900 bg-neutral-950/50 p-4">
              <p className="text-xs text-neutral-500">
                KoralSwap - Native DEX on Konet Chain
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
