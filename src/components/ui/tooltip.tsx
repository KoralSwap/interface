import React, { ReactNode } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hoverCard";
import Image from "next/image";
import { HoverCardArrow } from "@radix-ui/react-hover-card";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";
export default function Tooltip({
  triggerImageSrc,
  children,
  maxWidth,
}: {
  children: ReactNode;
  triggerImageSrc: string | StaticImageData;
  maxWidth?: string;
}) {
  return (
    <HoverCard openDelay={0} closeDelay={200}>
      <HoverCardTrigger>
        <Image
          src={triggerImageSrc}
          width={16}
          height={16}
          alt="question mark"
        />
      </HoverCardTrigger>
      <HoverCardContent side="top" alignOffset={10}>
        <div
          style={{ maxWidth: maxWidth ?? "200px" }}
          className=" rounded-md text-sm bg-neutral-900 px-2 py-2 text-white"
        >
          {children}
        </div>
        <HoverCardArrow className="fill-neutral-900" height={15} width={14} />
      </HoverCardContent>
    </HoverCard>
  );
}
