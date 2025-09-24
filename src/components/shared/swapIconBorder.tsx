import React from "react";
import swap from "@/assets/swap.svg";
import Image from "next/image";
import { forwardRef } from "react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  swapIconClick: () => void;
}

const SwapIconBorder = forwardRef<HTMLDivElement, Props>(
  ({ className, swapIconClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full flex justify-center absolute  translate-y-[-50%] items-center  ${className}`}
        {...props}
      >
        <button
          type="button"
          onClick={swapIconClick}
          className="bg-neutral-950 cursor-pointer p-2 rounded-md"
        >
          <Image src={swap} alt="swap" width={18} height={18} />
        </button>
      </div>
    );
  }
);

SwapIconBorder.displayName = "SwapIconBorder";

export default SwapIconBorder;
// export default function SwapIconBorder() {
//   return (
//     <div className="w-full  flex items-center py-8">
//       <div className="flex-grow h-[2px] bg-neutral-950"></div>
//       <div className="bg-neutral-950 p-2 rounded-md">
//         <Image src={swap} alt="swap" width={18} height={18} />
//       </div>
//       <div className="flex-grow h-[2px] bg-neutral-950"></div>
//     </div>
//   );
// }
