import React from "react";
import Reactor from "@/assets/reactor.svg";
import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="py-12 border-t border-neutral-900 mt-12">
      <div className="mx-auto xl:w-[1400px]">
        <div className="grid grid-cols-5">
          <div className="flex flex-col col-span-2 justify-between">
            <div>
              <Image alt="logo" src={Reactor} />
            </div>
            <div>
              <span className="text-[12px]">
                2024 © Reactor Finance. All rights reserved.
              </span>
            </div>
          </div>
          <Headers />
          <Headers />
          <Headers />
        </div>
      </div>
    </footer>
  );
}
function Headers() {
  return (
    <div>
      <h4 className="text-neutral-500 text-sm">Features</h4>
      <ul className="space-y-4 pt-6 text-neutral-200">
        <li>
          <Link href="">Trade</Link>
        </li>
        <li>
          <Link href="">Trade</Link>
        </li>
        <li>
          <Link href="">Trade</Link>
        </li>
      </ul>
    </div>
  );
}
