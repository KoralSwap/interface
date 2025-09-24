import React, { ReactNode } from "react";
import questionMark from "@/assets/question-mark.svg";
import Tooltip from "./tooltip";

function GradiantHeaderOne({
  children,
}: {
  colorOne?: string;
  colorTwo?: string;
  children: ReactNode;
}) {
  return (
    <h1
      className={`bg-clip-text text-transparent text-xl md:text-[32px] inline-block font-medium`}
      style={{
        backgroundImage: `linear-gradient(to right, #EEF2FF, #836EF9)`,
      }}
    >
      {children}
    </h1>
  );
}

function InfoHeaderTwo({
  children,
  popupContent,
}: {
  children: ReactNode;
  popupContent: ReactNode;
}) {
  return (
    <h1 className={`flex items-center gap-x-2 font-medium text-lg md:text-2xl`}>
      <span>{children}</span>
      <div className="hidden md:block">
        <Tooltip triggerImageSrc={questionMark}>{popupContent}</Tooltip>
      </div>
    </h1>
  );
}
const Headers = {
  GradiantHeaderOne,
  InfoHeaderTwo,
};
export default Headers;
