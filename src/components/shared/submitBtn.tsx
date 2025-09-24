"use client";
import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { Button, ButtonProps } from "../ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Spinner from "../ui/spinner";

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
        return "Waiting for Signature...";
      case ButtonState.Loading:
        return "Loading...";
      case ButtonState.Sending:
        return "Transaction Pending";
      case ButtonState.Fetching:
        return "Loading Data...";
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

  return !isConnected ? (
    <Button onClick={openConnectModal} variant="primary" size="submit">
      Connect Wallet
    </Button>
  ) : (
    <Button
      {...props}
      data-pending={isLoading || !isValid ? "true" : "false"}
      disabled={
        isLoading ||
        !isValid ||
        state === ButtonState.Fetching ||
        (validationError !== null && typeof validationError !== "undefined")
      }
      variant="primary"
      size="submit"
    >
      <div className="flex gap-x-4 justify-center items-center">
        {(state === ButtonState.Fetching ||
          state === ButtonState.Loading ||
          state === ButtonState.Sending) && <Spinner />}
        <span>
          {!validationError || isLoading ? buttonText : validationError}
        </span>
      </div>
    </Button>
  );
}
