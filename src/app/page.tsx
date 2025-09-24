"use client";
import bg from "@/assets/bg-img.png";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount } from "wagmi";

export default function Page() {
  const { isConnected } = useAccount();
  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
      <div className="absolute top-0 left-0 object-fill h-full w-screen  -z-10  flex justify-center items-center">
        <Image className="object-cover w-full h-full" src={bg} alt="bg" />
      </div>
      {!isConnected && <ConnectView />}
    </div>
  );
}
function ConnectView() {
  const { openConnectModal } = useConnectModal();
  return (
    <>
      <div className="flex flex-col mb-[88px] items-center gap-y-4 z-10">
        <h1 className=" text-[22px] leading-[26px] lg:text-[36px] lg:leading-[40px]">
          Connect your wallet
        </h1>
        <p className="text-neutral-400 text-sm lg:text-[16px]">
          Log in to access world-class DeFi experience
        </p>
        <Button
          size="md"
          onClick={() => {
            openConnectModal?.();
          }}
          variant={"primary"}
        >
          Connect your wallet
        </Button>
      </div>
    </>
  );
}
