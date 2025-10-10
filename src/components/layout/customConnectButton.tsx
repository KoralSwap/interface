"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronDown, Wallet } from "lucide-react";

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="primary"
                    size="md"
                    className="group relative overflow-hidden"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Wallet size={18} />
                      <span className="hidden sm:inline">Connect Wallet</span>
                      <span className="sm:hidden">Connect</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-primary-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    variant="outline"
                    className="rounded-lg border-2 border-error-500 bg-error-950/50 text-error-400 hover:bg-error-950 transition-all duration-200"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <Button
                    variant="filled"
                    size="sm"
                    className="group flex items-center gap-2 rounded-lg border border-neutral-900 bg-neutral-1000 text-white transition-all duration-200 hover:border-blue-500/50 hover:bg-neutral-950 px-2"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {/* Balance */}
                    <span className="hidden px-3 text-sm font-medium sm:inline">
                      {account.displayBalance}
                    </span>

                    {/* Account Info */}
                    <div className="flex items-center gap-2 rounded-md bg-neutral-950 px-3 py-1.5 transition-colors group-hover:bg-neutral-900">
                      {/* Avatar */}
                      <div className="h-6 w-6 flex-shrink-0">
                        {!account.ensAvatar ? (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold">
                            {account.displayName.slice(0, 2).toUpperCase()}
                          </div>
                        ) : (
                          <Image
                            width={24}
                            height={24}
                            className="h-full w-full rounded-full"
                            src={account.ensAvatar}
                            alt="Avatar"
                          />
                        )}
                      </div>

                      {/* Name */}
                      <span className="text-sm font-medium">
                        {account.displayName}
                      </span>

                      {/* Chevron */}
                      <ChevronDown
                        size={16}
                        className="transition-transform group-hover:translate-y-0.5"
                      />
                    </div>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
