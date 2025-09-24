"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import lucide from "@/assets/lucide.png";
import { annoucementModal } from "@/store";
import { useAtom } from "jotai";

export default function Announcement() {
  const [open, setOpen] = useAtom(annoucementModal);
  const [dialogOpen, setDialogOpen] = useState(open);
  useEffect(() => {
    setOpen(false);
  }, [dialogOpen, setOpen]);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent removeClose className=" lg:w-[450px]">
        <div className="absolute right-0 top-0">
          <Image src={lucide} alt="lucide" />
        </div>
        <DialogTitle className="text-[20px] font-normal text-primary-400">
          Annoucement!
        </DialogTitle>
        <p className="text-[12px] text-neutral-300">
          The Monad Testnet is experiencing high traffic, which may cause delays
          in loading tokens, fetching trade quotes, or, in some cases, failing
          to generate quotes. This will improve as more nodes become available.
          We appreciate your patience.
        </p>
        <Button
          onClick={() => setDialogOpen(false)}
          variant={"primary"}
          size="submit"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
