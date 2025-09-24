import { useEffect, useRef, useState } from "react";
type val = string | number | boolean | undefined;
interface Props {
  dependencies: val[];
}
export default function useInitializePage({ dependencies }: Props) {
  const [enabled, setEnabled] = useState(false);
  const initialized = useRef<boolean>(false);
  useEffect(() => {
    // ** this stops react query refetching our data from server
    // until one of the filters changes
    if (!initialized.current) {
      initialized.current = true;
    } else {
      if (!enabled) setEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies]);
  console.log({ enabled });
  return { enabled };
}
