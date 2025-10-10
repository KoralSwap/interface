"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { CustomConnectButton } from "./customConnectButton";
import { useAccount } from "wagmi";
import SideNav from "./sideNav";

export default function Header() {
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900/50 bg-neutral-1050/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between lg:grid lg:grid-cols-12 lg:gap-4">
          {/* Logo */}
          <div className="lg:col-span-2">
            <button
              className="transition-transform hover:scale-105"
              role="link"
              onClick={() => router.push("/")}
            >
              <span className="text-xl font-bold text-gradient">KoralSwap</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <SideNav />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:col-span-7 lg:flex lg:items-center lg:justify-center">
            <ul className="flex items-center gap-1">
              {isConnected && (
                <>
                  <NavLink href="/swap">Swap</NavLink>
                  <NavLink href="/liquidity">Liquidity</NavLink>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                </>
              )}
              <NavLink href="/docs">Docs</NavLink>
            </ul>
          </nav>

          {/* Connect Button */}
          <div className="flex items-center justify-end gap-3 lg:col-span-3">
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children?: React.ReactNode;
}) {
  const path = usePathname();
  const isActive = path.includes(href);

  return (
    <li>
      <Link
        className={`
          relative px-4 py-2 text-sm font-medium transition-all duration-200
          ${isActive ? "text-white" : "text-neutral-400 hover:text-white"}
        `}
        href={href}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-primary" />
        )}
      </Link>
    </li>
  );
}
