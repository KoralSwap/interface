import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";

export default function DisplayFormattedNumber({
  num,
  formatNum,
}: {
  num: string | number;
  formatNum?: boolean;
}) {
  let number = useMemo(() => {
    if (typeof num === "number") {
      return num.toString();
    } else {
      return num;
    }
  }, [num]);
  const { sig, exp } = useMemo(() => {
    if (number.includes("v")) {
      const split = number.split("v")[1];
      if (!split) return { sig: "0", exp: 0 };
      return { sig: split.slice(1, split.length), exp: split[0] };
    }
    return { sig: "0", exp: 0 };
  }, [number]);

  if (formatNum) {
    number = formatNumber(number);
    if (!num.toString().includes("v")) {
      return number;
    }
  }
  if (!number.includes("v")) {
    return number;
  }
  return (
    <>
      0.0
      <sub>{exp}</sub>
      {sig}
    </>
  );
}
