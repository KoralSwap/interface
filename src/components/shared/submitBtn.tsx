"use client";

import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { Button, ButtonProps } from "../ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Spinner from "../ui/spinner";
import { Loader2 } from "lucide-react";

export enum ButtonState {
  Signing = "SIGNING",
  Fetching = "FETCHING",
  Sending = "SENDING",
  Loading = "LOADING",
  Approve = "APPROVE",
  Wrap = "WRAP",
  Default = "DEFAULT",
}

interface Props extends ButtonProps {
  state: ButtonState;
  isValid: boolean;
  approveTokenSymbol?: string;
  validationError?: string | null;
}

export default function SubmitButton({
  state,
  isValid,
  validationError,
  ...props
}: Props) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const buttonText = useMemo(() => {
    switch (state) {
      case ButtonState.Signing:
        return "Awaiting Signature...";
      case ButtonState.Loading:
        return "Processing...";
      case ButtonState.Sending:
        return "Confirming Transaction...";
      case ButtonState.Fetching:
        return "Loading...";
      default:
        return props.children;
    }
  }, [props.children, state]);

  const isLoading = useMemo(
    () =>
      state === ButtonState.Loading ||
      state === ButtonState.Signing ||
      state === ButtonState.Sending,
    [state]
  );

  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        variant="primary"
        size="lg"
        className="w-full text-base font-semibold"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button
      {...props}
      disabled={
        isLoading ||
        !isValid ||
        state === ButtonState.Fetching ||
        (validationError !== null && typeof validationError !== "undefined")
      }
      variant="primary"
      size="lg"
      className={`
        w-full text-base font-semibold
        ${isLoading ? "cursor-wait" : ""}
        ${!isValid || validationError ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-center justify-center gap-3">
        {(state === ButtonState.Fetching ||
          state === ButtonState.Loading ||
          state === ButtonState.Sending ||
          state === ButtonState.Signing) && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
        <span>
          {!validationError || isLoading ? buttonText : validationError}
        </span>
      </div>
    </Button>
  );
}
