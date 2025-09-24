import { ButtonState } from "../submitBtn";

interface Props {
  isLoading: boolean;
  isPending: boolean;
  needsApproval?: boolean | undefined;
  isFetching?: boolean | undefined;
  isSending?: boolean;
}
export default function useGetButtonStatuses({
  isLoading,
  isPending,
  isSending,
  needsApproval,
  isFetching,
}: Props) {
  if (isLoading) {
    return {
      state: ButtonState.Loading,
    };
  }
  if (isFetching) {
    return { state: ButtonState.Fetching };
  }
  if (isPending) {
    return {
      state: ButtonState.Signing,
    };
  }
  if (needsApproval) {
    return {
      state: ButtonState.Approve,
    };
  }
  if (isSending) {
    return {
      state: ButtonState.Sending,
    };
  }
  return {
    state: ButtonState.Default,
  };
}
