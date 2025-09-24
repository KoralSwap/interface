import useGetRctBalance from "@/lib/hooks/useGetRctBalance";
import { formatUnits } from "viem";
interface Props {
  form: {
    amount: string;
    duration: number[];
  };
}
export default function useCreateLockValidation({ form }: Props) {
  const { rctBalance } = useGetRctBalance();
  if (form.amount === "") {
    return { isValid: false, error: null };
  }
  if (Number.parseFloat(form.amount) <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }
  if (
    Number.parseFloat(formatUnits(rctBalance ?? 0n, 18)) <
    Number.parseFloat(form.amount)
  ) {
    return { isValid: false, error: "Insufficient Balance." };
  }
  return { isValid: true, error: null };
}
