import React from "react";

export default function PageMarginContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "mx-auto animate-in transition-opacity min-h-[calc(100vh-332px)] fade-in duration-700 px-2 md:px-6 2xl:py-14  py-2 xl:py-10 xl:w-[1200px] 2xl:w-[1500px] " +
        className
      }
    >
      {children}
    </div>
  );
}
