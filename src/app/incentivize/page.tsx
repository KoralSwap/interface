"use client";
import { Card } from "@/components/ui/card";
import Headers from "@/components/ui/headers";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { formatUnits } from "viem/utils";
import { Alert } from "@/components/ui/alert";
import SubmitButton, { ButtonState } from "@/components/shared/submitBtn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Address, formatEther, parseUnits, zeroAddress } from "viem";
import PoolHeader from "@/components/shared/poolHeader";
import { convertWETHToPlainETHIfApplicable, useGetTokenInfo } from "@/utils";
import { TPoolType, TToken } from "@/lib/types";
import TokensDialog from "@/components/shared/tokensDialog";
import { useGetBalance } from "@/lib/hooks/useGetBalance";
import IncentivesInput from "./__components__/incentivesInput";
import { useTransactionToastProvider } from "@/contexts/transactionToastProvider";
import useIncentivize from "./__hooks__/useIncentivize";
import DisplayFormattedNumber from "@/components/shared/displayFormattedNumber";
import usePoolQueries from "@/lib/hooks/envio/usePoolQueries";
import { Pool } from "@/gql/graphql";
import useVoterCalls from "@/lib/hooks/voter/useVoterCalls";
import useCheckAllowance from "@/lib/hooks/useCheckAllowance";
import useGrantApproval from "@/lib/hooks/useGrantApproval";
import useGaugeCalls from "@/lib/hooks/gauges/useGaugeCalls";
import { GaugeType } from "@/lib/hooks/gauges/shared";

export default function Page() {
  const { useQLGetAllPools, useQLGetAccountLPPositions } = usePoolQueries();
  const { data: QLAllPools } = useQLGetAllPools(1000, 0, 30000);
  const { data: QLPositions } = useQLGetAccountLPPositions(1000, 30000);
  const eligiblePairs = useMemo(() => {
    if (!QLAllPools) return [];
    return QLAllPools.Pool.filter(
      (pool) => pool.gauge !== null && typeof pool.gauge !== "undefined"
    );
  }, [QLAllPools]);
  const [selectedPool, setSelectedPool] = useState<Pool>();
  const token0 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(
      (selectedPool?.token0?.address as Address) ?? zeroAddress
    )
  );
  const token1 = useGetTokenInfo(
    convertWETHToPlainETHIfApplicable(
      (selectedPool?.token1?.address as Address) ?? zeroAddress
    )
  );

  const lpPosition = useMemo(() => {
    if (!QLPositions || !selectedPool) return;
    return QLPositions.LiquidityPosition.find(
      (lp) =>
        lp.pool?.address.toLowerCase() === selectedPool.address.toLowerCase()
    );
  }, [QLPositions, selectedPool]);

  const { usePoolWeights } = useVoterCalls();
  const { useCheckGaugeRewardRate } = useGaugeCalls();
  const { weight: poolWeight } = usePoolWeights({
    pool: selectedPool?.address as Address,
    refetchInterval: 30000,
  });
  const { data: rate } = useCheckGaugeRewardRate({
    gaugeType:
      selectedPool?.poolType === "CONCENTRATED" ? GaugeType.CL : GaugeType.V2,
    address: selectedPool?.gauge?.address as Address,
    refetchInterval: 30000,
  });
  const formattedRate = useMemo(() => formatEther(rate), [rate]);

  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [selectedIncentiveToken, setSelectedIncentiveToken] =
    useState<TToken>();
  const [amount, setAmount] = useState("0");
  const parsedAmount = useMemo(
    () => parseUnits(amount, selectedIncentiveToken?.decimals ?? 18),
    [amount, selectedIncentiveToken?.decimals]
  );
  const { balance } = useGetBalance(selectedIncentiveToken?.address, 30000);

  const { setToast } = useTransactionToastProvider();

  const { isAllowed, refresh: refreshAllowance } = useCheckAllowance(
    selectedIncentiveToken?.address,
    selectedPool?.gauge?.bribeVotingReward as Address,
    parsedAmount
  );
  const {
    execute: executeGrantApproval,
    isError: approvalError,
    isPending: approvalPending,
    isSuccess: approvalSuccess,
    reset: resetGrantApproval,
  } = useGrantApproval({
    token: selectedIncentiveToken?.address as Address,
    spender: selectedPool?.gauge?.bribeVotingReward as Address,
    amount: parsedAmount,
    onSuccess: (hash) => {
      setToast({
        actionTitle: `${selectedIncentiveToken?.symbol} spend approved`,
        actionDescription: "",
        toastType: "success",
        hash,
      });

      void refreshAllowance();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const {
    execute: executeIncentivize,
    isError: incentivizeError,
    isPending: incentivizePending,
    isSuccess: incentivizeSuccess,
    reset: resetIncentivize,
  } = useIncentivize({
    bribe: selectedPool?.gauge?.bribeVotingReward as Address,
    reward: parsedAmount,
    token: selectedIncentiveToken?.address,
    onSuccess: (hash) => {
      setToast({
        actionTitle: "Incentives added",
        actionDescription: "You have successfully incentivized this pool",
        toastType: "success",
        hash,
      });

      void refreshAllowance();
    },
    onError: (err) =>
      setToast({
        actionTitle: "Transaction failed: " + err.cause,
        actionDescription: "",
        toastType: "error",
      }),
  });

  const buttonState = useMemo(
    () =>
      approvalPending || incentivizePending
        ? ButtonState.Loading
        : ButtonState.Default,
    [approvalPending, incentivizePending]
  );

  const onSubmit = useCallback(() => {
    if (!isAllowed) {
      executeGrantApproval();
      return;
    }
    executeIncentivize();
  }, [isAllowed, executeIncentivize, executeGrantApproval]);

  useEffect(() => {
    if (approvalSuccess || approvalError) resetGrantApproval();
    if (incentivizeError || incentivizeSuccess) resetIncentivize();
  }, [
    approvalError,
    approvalSuccess,
    incentivizeError,
    incentivizeSuccess,
    resetGrantApproval,
    resetIncentivize,
  ]);

  return (
    <>
      <TokensDialog
        open={tokenDialogOpen}
        onOpen={setTokenDialogOpen}
        onTokenSelected={setSelectedIncentiveToken}
        selectedTokens={[selectedIncentiveToken?.address ?? zeroAddress]}
      />
      <PageMarginContainer className="flex justify-center">
        <div className="max-w-[500px]">
          <div className="flex justify-between items-end pb-2">
            <Headers.GradiantHeaderOne>Incentivize</Headers.GradiantHeaderOne>
            <span className="text-[13px] font-light text-neutral-400">
              Request token whitelist
            </span>
          </div>
          <Card className="w-full" bg="1000">
            <div className="space-y-4">
              <div className="text-sm text-neutral-400">Choose a pool</div>

              <Select
                onValueChange={(value) =>
                  setSelectedPool(
                    eligiblePairs.find(
                      (pool) =>
                        pool.address.toLowerCase() === value.toLowerCase()
                    ) as Pool
                  )
                }
              >
                <SelectTrigger className="flex  py-4 bg-neutral-950 border-neutral-900">
                  <div className="flex justify-center  items-center gap-x-2 ">
                    <SelectValue placeholder="Select pool for bribe">
                      {token0 && token1 && selectedPool && (
                        <PoolHeader
                          poolAddress={selectedPool.address as Address}
                          token0={token0}
                          token1={token1}
                          poolType={
                            selectedPool.poolType === "STABLE"
                              ? TPoolType.STABLE
                              : selectedPool.poolType === "VOLATILE"
                                ? TPoolType.VOLATILE
                                : TPoolType.CONCENTRATED
                          }
                        />
                      )}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {eligiblePairs.map((pair) => (
                      <SelectItem key={pair.id} value={pair.address}>
                        {pair.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex justify-between border-y border-neutral-900 py-4 text-sm">
                <span className="text-neutral-400">Your Position</span>
                <span>
                  {selectedPool && lpPosition ? (
                    <DisplayFormattedNumber
                      num={formatNumber(lpPosition.position)}
                    />
                  ) : (
                    "No position"
                  )}
                </span>
              </div>
              <div className="grid text-sm grid-cols-3 pb-4 border-b border-neutral-900">
                <div className="flex flex-col text-sm items-start">
                  <div>APR</div>
                  <div className="text-neutral-400">
                    <DisplayFormattedNumber num={formatNumber(formattedRate)} />
                    %
                  </div>
                </div>
                <div className="flex flex-col text-sm items-start md:items-center">
                  <div>Current Votes</div>
                  <div className="text-neutral-400">
                    <DisplayFormattedNumber
                      num={formatNumber(formatEther(poolWeight))}
                    />
                  </div>
                </div>
                <div className="flex flex-col text-sm items-start md:items-end">
                  <div>Total Incentives</div>
                  <div className="text-neutral-400">
                    ~$
                    <DisplayFormattedNumber
                      num={formatNumber(selectedPool?.totalBribesUSD ?? 0)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-end">
                  <h5 className="text-neutral-300 text-[13px]">
                    Available:{" "}
                    <span className="text-white">
                      <DisplayFormattedNumber
                        num={formatNumber(
                          formatUnits(
                            balance,
                            selectedIncentiveToken?.decimals ?? 18
                          )
                        )}
                      />{" "}
                      {selectedIncentiveToken?.symbol}
                    </span>
                  </h5>
                </div>
                <IncentivesInput
                  type="number"
                  token={selectedIncentiveToken}
                  onButtonClick={() => setTokenDialogOpen(true)}
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
              </div>
              <Alert colors="muted">
                {`Incentives are usually provided by the protocols. By continuing
              with the next steps you acknowledge that you understand the
              mechanics of the protocol and that after depositing any rewards as
              incentives you won't be able to withdraw them.`}
              </Alert>
              <SubmitButton
                state={buttonState}
                isValid={
                  !approvalPending &&
                  !incentivizePending &&
                  !!selectedPool &&
                  !!selectedIncentiveToken
                }
                onClick={onSubmit}
              >
                {isAllowed ? "Add Incentives" : "Approve"}
              </SubmitButton>
            </div>
          </Card>
        </div>
      </PageMarginContainer>
    </>
  );
}
