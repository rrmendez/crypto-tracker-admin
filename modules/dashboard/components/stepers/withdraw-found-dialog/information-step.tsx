/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useTranslate } from "@/locales";
import { Currency, Wallet, TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Decimal from "decimal.js";
import SendForm from "../forms/send-form";
import useTransactions from "@/hooks/use-transactions";
import { useWallets } from "@/hooks/use-wallets";
import { fNumber } from "@/utils/format-number";
import { networkValidators } from "@/utils/crypto-currencies";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

interface WithdrawFoundDialogProps {
  onClose: () => void;
  onNext: (step: string, data: any) => void;
  gasProvider?: Wallet;
  values: any;
  type: string;
}

export default function InformationStep({
  onClose,
  onNext,
  gasProvider,
  values,
  type,
}: WithdrawFoundDialogProps) {
  const { t } = useTranslate(["dashboard"]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(
    values.currency || undefined
  );
  const balances = useMemo(() => gasProvider?.balances ?? [], [gasProvider?.balances]);
  const [nativeGas, setNativeGas] = useState(0);

  const { getLimits, getPrices } = useWallets();
  const { getFeeQuery } = useTransactions();
  const { getNativeGasMutation } = useTransactions();

  const { data: prices } = getPrices;

  const currencyPrice = useMemo(
    () => prices?.find((p) => p.currencyId === selectedCurrency?.id),
    [prices, selectedCurrency?.id]
  );

  useEffect(() => {
    if (balances.length > 0) {
      const firstBalance = balances[0];
      const currencyWithBalance = {
        ...firstBalance.currency,
        balance: firstBalance.balance,
      };
      setSelectedCurrency(currencyWithBalance as unknown as Currency & { balance: number });
    }
    return () => {
      setSelectedCurrency(undefined);
    };
  }, [balances]);

  const handleUpdateNativeGas = useDebouncedCallback((value: string) => {
    getNativeGasMutation.mutate(
      {
        currencyId: selectedCurrency?.id ?? "",
        amount: new Decimal(value).toDecimalPlaces(decimals).toNumber(),
      },
      {
        onSuccess: (data) => {
          const gas = new Decimal(data.totalGasNative).toDecimalPlaces(decimals).toNumber();
          setNativeGas(gas);
        },
      }
    );
  }, 1000);

  const handleCurrencyChange = useCallback(
    (code: string) => {
      const found = balances.find((b) => `${b.currency.code}-${b.currency.network}` === code);
      if (found) {
        const currencyWithBalance = {
          ...found.currency,
          balance: found.balance,
        };
        setSelectedCurrency(currencyWithBalance as unknown as Currency & { balance: number });
      }
    },
    [balances]
  );

  const { data: limits } = getLimits(gasProvider?.id ?? "", TransactionType.WITHDRAW);

  const { data: fees } = getFeeQuery({
    currency: selectedCurrency?.id ?? "",
    operation: TransactionType.WITHDRAW,
  });

  const totalFees = useMemo(() => {
    if (!fees?.length) return { fixedValue: 0, percentValue: 0 };
    return fees.reduce(
      (acc: any, fee: any) => {
        if (fee.type === "FIXED") acc.fixedValue += parseFloat(fee.value);
        if (fee.type === "PERCENT") acc.percentValue += parseFloat(fee.value);
        return acc;
      },
      { fixedValue: 0, percentValue: 0 }
    );
  }, [fees]);

  const decimals = useMemo(() => {
    if (!selectedCurrency?.decimals) return 8;
    return selectedCurrency.decimals > 8 ? 8 : selectedCurrency.decimals;
  }, [selectedCurrency?.decimals]);

  const maxAllowed = useMemo(() => {
    if (!selectedCurrency?.balance) return 0;

    const balance = new Decimal(selectedCurrency.balance);
    const fixedFee = new Decimal(totalFees.fixedValue || 0);
    const percentFee = new Decimal(totalFees.percentValue || 0).dividedBy(100);

    const max = balance.minus(fixedFee).dividedBy(percentFee.plus(1));

    return max.lessThan(0) ? 0 : max.toNumber();
  }, [selectedCurrency?.balance, totalFees]);

  const formSchema = z.object({
    to:
      networkValidators[selectedCurrency?.network as keyof typeof networkValidators]?.refine(
        (val) => val !== gasProvider?.address,
        { message: t("send.form.to.notSame", { ns: "dashboard" }) }
      ) ?? z.string().min(1),
    amount: z
      .union([z.number(), z.string()])
      .refine((val) => !isNaN(+val), {
        message: t("send.form.amount.notValid", { ns: "dashboard" }),
      })
      .refine(
        (val) => {
          if (!limits) return +val > 0;
          return +val >= +limits.minimumPerOperation;
        },
        {
          message: t("send.form.amount.min", {
            ns: "dashboard",
            min: +fNumber(limits?.minimumPerOperation || 0, { maximumFractionDigits: 8 }),
          }),
        }
      )
      .refine(
        (val) => {
          const percent = totalFees.percentValue / 100;
          const fixed = totalFees.fixedValue;
          const maxSendable = new Decimal(maxAllowed || 0)
            .minus(fixed)
            .dividedBy(1 + percent)
            .toDecimalPlaces(decimals);
          const value = new Decimal(val || 0).toDecimalPlaces(decimals);
          return value.lessThanOrEqualTo(maxSendable);
        },
        {
          message: t(`send.form.amount.${!limits ? "notBalance" : "notAllowed"}`, {
            ns: "dashboard",
          }),
        }
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { to: values.to || "", amount: values.amount || "" },
  });

  const { watch } = form;
  const formValues = watch();

  const fee = useMemo(() => {
    return totalFees.fixedValue + (totalFees.percentValue * +formValues.amount) / 100;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFees, formValues.amount, decimals]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      to: data.to,
      amount: data.amount,
      currency: selectedCurrency,
      currencyPrice,
      fee,
      decimals,
      nativeGas,
    };
    onNext("details", payload);
  };

  if (!gasProvider || !selectedCurrency) {
    return (
      <Card className="bg-background border-0">
        <CardContent className="space-y-4 animate-pulse">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="bg-amber-100/40 dark:bg-amber-900/40 rounded-md p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" /> <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-3 w-full" /> <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full rounded-md" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" /> <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-0">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">
            {t("whithdraw.informationStep.currencyLabel", { ns: "dashboard" })}
          </Label>
          <Select
            value={selectedCurrency ? `${selectedCurrency.code}-${selectedCurrency.network}` : ""}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue
                placeholder={t("gasProvider.placeholder.currency", { ns: "dashboard" })}
              />
            </SelectTrigger>
            <SelectContent>
              {balances.map(({ currency }) => (
                <SelectItem
                  key={`${currency.code}-${currency.network}`}
                  value={`${currency.code}-${currency.network}`}
                >
                  {currency.code} {type !== "GAS" && `(${t("network." + currency.network)})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Alert className="bg-amber-100/40 text-amber-600 dark:bg-amber-900 dark:text-amber-500 shadow-lg border-0 max-w-lg mx-auto">
          <Info />
          <AlertDescription>
            <p className="text-xs">
              <Trans
                ns="dashboard"
                i18nKey="alert.textOne"
                components={[
                  <span key="send-alert-component-0" className="font-semibold">
                    ({selectedCurrency?.networkCode.toUpperCase()}) - {selectedCurrency?.name}
                  </span>,
                ]}
              />
            </p>
          </AlertDescription>
        </Alert>

        <SendForm
          form={form}
          currency={selectedCurrency}
          totalFees={totalFees}
          maxAllowed={maxAllowed}
          decimals={decimals}
          nativeGas={nativeGas}
          onUpdateNativeGas={handleUpdateNativeGas}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t("whithdraw.informationStep.cancel", { ns: "dashboard" })}
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>
          {t("whithdraw.informationStep.continue", { ns: "dashboard" })}
        </Button>
      </CardFooter>
    </Card>
  );
}
