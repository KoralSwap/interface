import React from "react";
import Link from "next/link";
import { Github, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-1050/50 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-6">
            <div className="mb-4">
              <span className="text-2xl font-bold text-gradient">
                KoralSwap
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-6 max-w-sm">
              A simple and efficient V2 AMM on Konet Chain. Trade tokens and
              provide liquidity to earn fees with lightning-fast transactions.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink
                href="https://github.com/KoralSwap"
                icon={<Github size={18} />}
              />
              <SocialLink href="/docs" icon={<FileText size={18} />} />
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-3">
              <FooterLink href="/swap">Swap</FooterLink>
              <FooterLink href="/liquidity">Liquidity</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </ul>
          </div>

          {/* Developers */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white mb-4">
              Developers
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/docs">Documentation</FooterLink>
              <li>
                <a
                  href="https://github.com/KoralSwap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-xs text-neutral-500">
              © 2024 KoralSwap. All rights reserved.
            </span>
            <div className="flex items-center gap-6 text-xs text-neutral-500">
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="transition-colors hover:text-white"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-neutral-400 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-900 bg-neutral-1000 text-neutral-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-neutral-950 hover:text-white"
    >
      {icon}
    </a>
  );
}
