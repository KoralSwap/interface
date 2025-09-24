"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

// Always ensure there's ample space between your imports and the rest of the code. It makes it cleaner and readable
type Toast = {
  hash?: `0x${string}`;
  actionTitle: string | undefined;
  actionDescription: string | undefined;
  toastType?: "success" | "error";
};

interface State {
  toastInfo: Toast | undefined;
}

const initialState: State = {
  toastInfo: undefined,
};

interface ContextType {
  state: State;
  setToast: (toast: Toast | undefined) => void;
}
const TransactionToastContext = createContext<ContextType | undefined>(
  undefined
);
interface Props {
  children: React.ReactNode;
}

export const TransactionToastProvider = ({ children }: Props) => {
  const [state, setState] = useState(initialState);
  const setToast = useCallback((toast: Toast | undefined) => {
    setState((prev) => ({ ...prev, toastInfo: toast }));
  }, []);
  return (
    <TransactionToastContext.Provider
      value={{
        state,
        setToast,
      }}
    >
      {children}
    </TransactionToastContext.Provider>
  );
};

// Custom hook to use the context
export const useTransactionToastProvider = () => {
  const context = useContext(TransactionToastContext);
  if (!context) {
    throw new Error(
      "useTransactionToastProvider must be used within a TransactionToastProvider"
    );
  }
  return context;
};
