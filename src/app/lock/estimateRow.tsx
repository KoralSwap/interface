import React from "react";

export default function EstimateRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <h5 className="text-neutral-200">{title}</h5>
      <h5 className="">{value}</h5>
    </div>
  );
}
