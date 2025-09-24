import React from "react";

export default function Spinner({
  height,
  width,
}: {
  height?: string;
  width?: string;
}) {
  return (
    <div
      style={{ height: height ?? "18px", width: width ?? "18px" }}
      className="spinner "
    ></div>
  );
}
