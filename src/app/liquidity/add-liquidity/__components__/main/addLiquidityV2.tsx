"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import AssetCard from "./assetCard";
import { useChainId } from "wagmi";
import { useV2AddLiquidity } from "../../../__hooks__/useAddLiquidity";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import {
  formatUnits,
  isAddress,
  maxUint256,
  parseUnits,
  zeroAddress,
} from "viem";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useV2CheckPair } from "@/lib/hooks/useCheckPair";
import { STRINGS, V2_ROUTER } from "@/data/constants";
import { useV2QuoteAddLiquidity } from "@/app/liquidity/__hooks__/useQuoteLiquidity";
import { convertETHToWETHIfApplicable, useGetTokenInfo } from "@/utils";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import { formatNumber } from "@/lib/utils";
import InitPoolInfo from "./initPoolInfo";
import { useDebounce } from "@/lib/hooks/useDebounce";
import useGetToken from "@/lib/hooks/useGetToken";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import useKoralSwapAPI from "@/lib/hooks/useKoralSwapAPI";
import { Card } from "@/components/ui/card";

const SearchParamsSchema = z.object({
  token0: z.string().refine((arg) => isAddress(arg)),
  token1: z.string().refine((arg) => isAddress(arg)),
  version: z.enum(["stable", "concentrated", "volatile"]),
});

export default function AddLiquidityV2() {
  // Wagmi parameters
  const chainId = useChainId();
  const [selectedInput, setSelectedInput] = useState<"0" | "1">("0");
  // Token list
  // Search params
  const params = useSearchParams();
  const { t0, t1, version } = useMemo(() => {
    const t0 = params.get("token0");
    const t1 = params.get("token1");
    const version = params.get("version");
    const param = { token0: t0, token1: t1, version };

    const afterParse = SearchParamsSchema.safeParse(param);
    if (!afterParse.success) {
      return { t0: undefined, t1: undefined, version: "stable" };
    }
    const { token1, token0, version: v } = afterParse.data;
    return { t1: token1, t0: token0, version: v };
  }, [params]);

  // Direct tokens
  const token0 = useGetTokenInfo(t0 ?? zeroAddress);
  const token1 = useGetTokenInfo(t1 ?? zeroAddress);
  const routerNav = useRouter();
  // If token is not in our token list, then fetch from contract
  const { isFetched: fetched0, token: fetchedToken0 } = useGetToken({
    address: t0,
    disabled: !!token0,
  });
  const { isFetched: fetched1, token: fetchedToken1 } = useGetToken({
    address: t1,
    disabled: !!token1,
  });

  const asset0 = useMemo(
    () =>
      !!token0
        ? token0
        : fetched0 && !!fetchedToken0
          ? fetchedToken0
          : undefined,
    [fetched0, fetchedToken0, token0]
  );
  const asset1 = useMemo(
    () =>
      !!token1
        ? token1
        : fetched1 && !!fetchedToken1
          ? fetchedToken1
          : undefined,
    [fetched1, fetchedToken1, token1]
  );
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const { debouncedValue: amount0Bounced } = useDebounce(amount0, 300);
  const { debouncedValue: amount1Bounced } = useDebounce(amount1, 300);
  const [amount0Parsed, amount1Parsed] = useMemo(
    () =>
      [
        parseUnits(amount0Bounced, asset0?.decimals ?? 18),
        parseUnits(amount1Bounced, asset1?.decimals ?? 18),
      ] as [bigint, bigint],
    [amount0Bounced, amount1Bounced, asset0, asset1]
  );

  // Router
  const router = useMemo(() => V2_ROUTER[chainId], [chainId]);
  // Check if pair exists
  const { exists: pairExists, pairAddress: pair } = useV2CheckPair(
    convertETHToWETHIfApplicable(t0 ?? zeroAddress, chainId),
    convertETHToWETHIfApplicable(t1 ?? zeroAddress, chainId),
    version === "stable",
    10000
  );
  // Quote liquidity
  const { amount0Needed, amount1Needed } = useV2QuoteAddLiquidity(
    convertETHToWETHIfApplicable(t0 ?? zeroAddress, chainId),
    convertETHToWETHIfApplicable(t1 ?? zeroAddress, chainId),
    version === "stable",
    amount0Parsed,
    amount1Parsed,
    30000
  );

  const { setToast } = useTransactionToastProvider();

  // Check allowance
  const token0AllowanceCheck = useCheckAllowance(
    asset0?.address,
    router,
    amount0Parsed,
    30000
  );
  const token1AllowanceCheck = useCheckAllowance(
    asset1?.address,
    router,
    amount1Parsed,
    30000
  );

  const {
    execute: executeGrantApproval0,
    isPending: approval0Pending,
    reset: resetApproval0,
    isSuccess: approval0Success,
    isError: approval0Error,
  } = useGrantApproval({
    token: asset0?.address,
    spender: router,
    amount: maxUint256,
    onSuccess: (hash) => {
      setToast({
        actionTitle: `Approved to spend ${asset0?.symbol}`,
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token0AllowanceCheck.refresh();
    },
    onError: (err) =>
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const {
    execute: executeGrantApproval1,
    isPending: approval1Pending,
    reset: resetApproval1,
    isSuccess: approval1Success,
    isError: approval1Error,
  } = useGrantApproval({
    token: asset1?.address,
    spender: router,
    amount: maxUint256,
    onSuccess: (hash) => {
      setToast({
        actionTitle: `Approved to spend ${asset1?.symbol}`,
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token1AllowanceCheck.refresh();
    },
    onError: (err) =>
      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const {
    execute: executeAddLiquidity,
    isPending: addLiquidityPending,
    isSuccess: addLiquiditySuccess,
    isError: addLiquidityError,
    reset: resetAddLP,
  } = useV2AddLiquidity({
    token0: asset0?.address ?? zeroAddress,
    token1: asset1?.address ?? zeroAddress,
    stable: version === "stable",
    amountADesired: amount0Parsed,
    amountBDesired: amount1Parsed,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Added Liquidity",
        actionDescription: "",
        hash,
        toastType: "success",
      });

      // Refresh allowances
      void token0AllowanceCheck.refresh();
      void token1AllowanceCheck.refresh();
    },
    onError: (err) => {
      console.error(err);

      setToast({
        actionTitle: `Transaction failed: ${err.cause}`,
        actionDescription: "",
        toastType: "error",
      });
    },
  });
  const { balance: balance0, refresh: refresh0 } = useGetBalance(
    asset0?.address,
    15000
  );
  const { balance: balance1, refresh: refresh1 } = useGetBalance(
    asset1?.address,
    15000
  );
  const { balance: lpBalance, refresh: refreshLPBalance } = useGetBalance(
    pair,
    15000
  );

  const onSubmit = useCallback(() => {
    if (!token0AllowanceCheck.isAllowed) {
      executeGrantApproval0();
      return;
    }

    if (!token1AllowanceCheck.isAllowed) {
      executeGrantApproval1();
      return;
    }

    executeAddLiquidity();
  }, [
    token0AllowanceCheck,
    token1AllowanceCheck,
    executeGrantApproval0,
    executeGrantApproval1,
    executeAddLiquidity,
  ]);

  const errorMessage = useMemo(() => {
    if (balance0 < amount0Parsed || balance1 < amount1Parsed)
      return STRINGS.INSUFFICIENT_BALANCE;
  }, [balance0, balance1, amount0Parsed, amount1Parsed]);

  const buttonState = useMemo(() => {
    if (approval0Pending || approval1Pending || addLiquidityPending)
      return ButtonState.Loading;
    else if (!token0AllowanceCheck.isAllowed || !token1AllowanceCheck.isAllowed)
      return ButtonState.Approve;
    else return ButtonState.Default;
  }, [
    approval0Pending,
    approval1Pending,
    addLiquidityPending,
    token0AllowanceCheck,
    token1AllowanceCheck,
  ]);

  const stateValid = useMemo(
    () =>
      !!token0 &&
      !!token1 &&
      (token0AllowanceCheck.isAllowed && token1AllowanceCheck.isAllowed
        ? balance0 >= amount0Parsed &&
          balance1 >= amount1Parsed &&
          amount0Parsed > 0n &&
          amount1Parsed > 0n &&
          !isNaN(Number(amount0)) &&
          !isNaN(Number(amount1))
        : true),
    [
      token0,
      token1,
      token0AllowanceCheck.isAllowed,
      token1AllowanceCheck.isAllowed,
      balance0,
      amount0Parsed,
      balance1,
      amount1Parsed,
      amount0,
      amount1,
    ]
  );

  const { useGetPoolData } = useKoralSwapAPI();
  const { poolData, refetch: refetchPoolData } = useGetPoolData(pair, 10000);

  // logic to set quote amounts to inputs
  useEffect(() => {
    if (!pairExists) return;
    if (selectedInput === "0" && pairExists && amount1Needed > 0n) {
      setAmount1(formatUnits(amount1Needed, asset1?.decimals ?? 18));
    } else if (selectedInput === "1" && pairExists && amount0Needed > 0n) {
      setAmount0(formatUnits(amount0Needed, asset0?.decimals ?? 18));
    }
  }, [pairExists, selectedInput, amount0Needed, amount1Needed, asset0, asset1]);

  useEffect(() => {
    if (!asset0 || !asset1) routerNav.push("/");
  }, [asset0, asset1, routerNav]);

  useEffect(() => {
    if (approval0Success || approval0Error) resetApproval0();
    if (approval1Success || approval1Error) resetApproval1();
    if (addLiquiditySuccess || addLiquidityError) {
      resetAddLP();
      Promise.all([
        refresh0(),
        refresh1(),
        refreshLPBalance(),
        refetchPoolData(),
      ])
        .then(() => console.info("Refreshed balances & pool"))
        .catch(console.error);
    }
  }, [
    addLiquiditySuccess,
    refresh0,
    refresh1,
    refreshLPBalance,
    approval0Success,
    approval0Error,
    approval1Success,
    approval1Error,
    resetApproval0,
    resetApproval1,
    resetAddLP,
    refetchPoolData,
    addLiquidityError,
  ]);
  return (
    <Card className="md:w-1/3 space-y-4 w-full bg-neutral-1000 border-neutral-900">
      <h2 className="text-xl">
        {pairExists ? "Add Liquidity" : "Initialize Pool"}
      </h2>{" "}
      {!!token0 && (
        <div className="space-y-2 w-full">
          <div>
            <label htmlFor="">Asset 1</label>
          </div>
          <AssetCard
            balance={balance0}
            onValueChange={setAmount0}
            token={token0}
            value={amount0}
            onFocus={() => setSelectedInput("0")}
          />
        </div>
      )}
      {!!token1 && (
        <div className="space-y-2 w-full">
          <div>
            <label htmlFor="">Asset 2</label>
          </div>
          <AssetCard
            balance={balance1}
            onValueChange={setAmount1}
            token={token1}
            value={amount1}
            onFocus={() => setSelectedInput("1")}
          />
        </div>
      )}
      {!pairExists && (
        <InitPoolInfo
          amount0={amount0}
          amount1={amount1}
          token0={token0}
          token1={token1}
        />
      )}
      {pairExists && poolData && (
        <>
          <div className="">
            <h5>Reserve Info</h5>
            <div className="pt-1"></div>
            <div className="space-y-1">
              <div className="flex text-neutral-300 text-sm justify-between">
                <span>{token0?.symbol} Amount</span>
                <span>
                  <DisplayFormattedNumber
                    num={formatNumber(
                      formatUnits(
                        poolData.token0.toLowerCase() ===
                          convertETHToWETHIfApplicable(
                            token0?.address ?? zeroAddress,
                            chainId
                          ).toLowerCase()
                          ? poolData.reserve0
                          : poolData.reserve1,
                        token0?.decimals ?? 18
                      )
                    )}
                  />
                </span>
              </div>
              <div className="flex text-neutral-300 text-sm justify-between">
                <span>{token1?.symbol} Amount</span>
                <span>
                  <DisplayFormattedNumber
                    num={formatNumber(
                      formatUnits(
                        poolData.token1.toLowerCase() ===
                          convertETHToWETHIfApplicable(
                            token1?.address ?? zeroAddress,
                            chainId
                          ).toLowerCase()
                          ? poolData.reserve1
                          : poolData.reserve0,
                        token1?.decimals ?? 18
                      )
                    )}
                  />
                </span>
              </div>
            </div>
          </div>
          <div>
            <h5>My Info</h5>

            <div className="flex pt-1 text-neutral-300 text-sm justify-between">
              <span>Amount</span>
              <span>
                <DisplayFormattedNumber
                  num={formatNumber(formatUnits(lpBalance, 18))}
                />{" "}
                lp
              </span>
            </div>
          </div>
        </>
      )}
      <SubmitButton
        state={buttonState}
        isValid={stateValid}
        validationError={errorMessage}
        onClick={onSubmit}
      >
        {!token0AllowanceCheck.isAllowed || !token1AllowanceCheck.isAllowed ? (
          <>
            {!token0AllowanceCheck.isAllowed
              ? `Approve ${asset0?.symbol}`
              : `Approve ${asset1?.symbol}`}
          </>
        ) : (
          "Add Liquidity"
        )}
      </SubmitButton>
    </Card>
  );
}
