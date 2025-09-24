"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

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
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
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
                    variant="filled"
                    className="text-white"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant={"outline"}
                    className="rounded-full border-red-300 text-red-300"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    variant="filled"
                    className="rounded-md flex  hover:bg-neutral-1000 transition-transform text-white p-[4px] md:p-[4px] border-none bg-neutral-1000"
                    onClick={openAccountModal}
                    type="button"
                  >
                    <div className="pl-1">{account.displayBalance}</div>
                    <div className="flex items-center hover:bg-neutral-950 bg-neutral-1000 group p-1 gap-x-2 rounded-md">
                      <div className="h-6 w-6">
                        {!account.ensAvatar && (
                          <div className="h-full text-[10px] items-center flex justify-center w-full bg-neutral-900 rounded-full">
                            ?
                          </div>
                        )}
                        {account.ensAvatar && (
                          <Image
                            width={24}
                            height={24}
                            className="w-ful h-full"
                            src={account.ensAvatar ?? ""}
                            alt="ENS Avatar"
                          />
                        )}
                      </div>
                      <div>{account.displayName}</div>
                      <div className="group-hover:scale-125 transition-all">
                        <ChevronDown />
                      </div>
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
