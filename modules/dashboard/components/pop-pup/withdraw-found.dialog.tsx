"use client";

import { Currency, Wallet } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { useTranslate } from "@/locales";
import { useCallback, useState } from "react";
import { Stepper } from "@/modules/profile/tabs/stepper";
import InformationStep from "../stepers/withdraw-found-dialog/information-step";
import DetailsStep from "../stepers/withdraw-found-dialog/details-step";
import CodeStep from "../stepers/withdraw-found-dialog/code-step";
import useTransactions from "@/hooks/use-transactions";
import Success from "@/modules/profile/tabs/success";

type WithdrawFoundDialogProps = {
  open: boolean;
  onClose: () => void;
  wallet: Wallet;
  type: string;
};

export type DetailsStepDataProps = {
  to: string;
  amount: number | string;
  nativeGas: number;
  currency: Currency | undefined;
  currencyPrice?: { usdPrice: number };
  fee: number;
  decimals: number;
};

export default function WithdrawFoundDialog({
  open,
  onClose,
  wallet,
  type,
}: WithdrawFoundDialogProps) {
  const { t } = useTranslate(["dashboard"]);
  const [currentStep, setCurrentStep] = useState("information");
  const [data, setData] = useState<DetailsStepDataProps>({
    to: "",
    amount: 0,
    nativeGas: 0,
    currency: undefined,
    currencyPrice: undefined,
    fee: 0,
    decimals: 0,
  });

  const { sendTransaction } = useTransactions();

  const steps = [
    { id: "information", label: t("whithdraw.steps.information", { ns: "dashboard" }) },
    { id: "details", label: t("whithdraw.steps.details", { ns: "dashboard" }) },
    { id: "code", label: t("whithdraw.steps.code", { ns: "dashboard" }) },
    { id: "success", label: t("whithdraw.steps.success", { ns: "dashboard" }) },
  ];

  const handleNextDetails = (step: string, data: DetailsStepDataProps) => {
    setData(data);
    setCurrentStep(step);
  };

  const handleSendTransaction = useCallback(
    async (code?: string) => {
      if (code) {
        try {
          await sendTransaction.mutateAsync({
            address: data.to,
            amount: Number(data.amount),
            currencyId: data.currency?.id ?? "",
            secondFactorCode: code,
            type: type,
          });
        } catch (err) {
          throw err;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendTransaction]
  );

  const handleNextCode = (step: string) => {
    setCurrentStep(step);
  };

  const handleNextSuccess = (step: string) => {
    setCurrentStep(step);
  };

  const handleBack = (step: string) => {
    setCurrentStep(step);
  };

  const handleClose = () => {
    setCurrentStep("information");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal>
      <DialogContent className="max-w-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("dialogs.withdraw", { ns: "dashboard" })}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex w-full flex-col  h-full">
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === "information" && (
            <InformationStep
              onNext={(step, data) => handleNextDetails(step, data)}
              onClose={onClose}
              gasProvider={wallet}
              values={data}
              type={type}
            />
          )}
          {currentStep === "details" && (
            <DetailsStep onBack={handleBack} onNext={handleNextCode} {...data} />
          )}
          {currentStep === "code" && (
            <CodeStep
              onBack={handleBack}
              onNext={handleNextSuccess}
              onConfirm={handleSendTransaction}
            />
          )}

          {currentStep === "success" && (
            <Success onClose={onClose} description="whithdraw.steps.success" ns="dashboard" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
