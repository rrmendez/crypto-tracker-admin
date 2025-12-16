"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/currency-input";
import { NumericFormat } from "react-number-format";
import { fNumber } from "@/utils/format-number";
import { useTranslate } from "@/locales";
import { Currency } from "@/types";
import { useMemo } from "react";

interface SendFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  currency: Currency;
  totalFees: { fixedValue: number; percentValue: number };
  maxAllowed: number;
  decimals: number;
  nativeGas: number;
  onUpdateNativeGas?: (value: string) => void;
}

export default function SendForm({
  form,
  currency,
  totalFees,
  maxAllowed,
  decimals,
  nativeGas,
  onUpdateNativeGas,
}: SendFormProps) {
  const { t } = useTranslate(["dashboard"]);

  const { watch } = form;
  const formValues = watch();

  const fee = useMemo(() => {
    return totalFees.fixedValue + (totalFees.percentValue * +formValues.amount) / 100;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFees, formValues.amount, decimals]);

  return (
    <Form {...form}>
      <form className="flex flex-col flex-1 justify-between gap-6 w-full max-w-md mx-auto pt-6">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("send.form.to.root", { ns: "dashboard" })}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={t("send.form.to.placeholder", { ns: "dashboard" })}
                    className="rounded-md shadow-xs pr-16"
                    {...field}
                  />
                  <Button
                    type="button"
                    className="absolute top-1/2 end-4 -translate-y-1/2"
                    size="icon"
                    variant="link"
                    onClick={() =>
                      navigator.clipboard.readText().then((text) => {
                        field.onChange(text);
                      })
                    }
                  >
                    {t("send.form.to.action.paste", { ns: "dashboard" })}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>{t("send.form.amount.root", { ns: "dashboard" })}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("send.form.amount.available", {
                      ns: "dashboard",
                      amount: fNumber(currency.balance, {
                        maximumFractionDigits: decimals,
                      }),
                      code: currency.code,
                    })}
                  </span>
                </div>
              </FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={CurrencyInput}
                  thousandSeparator=" "
                  decimalSeparator="."
                  decimalScale={decimals}
                  allowNegative={false}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);

                    if (currency.smartContractAddress === "main") {
                      onUpdateNativeGas?.(values.value);
                    }
                  }}
                  currency={currency.code}
                  decimal={decimals}
                  onMax={
                    maxAllowed > 0
                      ? () => {
                          const percent = totalFees.percentValue / 100;
                          const fixed = totalFees.fixedValue + nativeGas;
                          const maxSendable = (maxAllowed - fixed) / (1 + percent);

                          field.onChange(maxSendable);
                        }
                      : undefined
                  }
                />
              </FormControl>
              <FormMessage />

              {fee > 0 && (
                <div className="flex items-center justify-end gap-2 w-full">
                  <FormDescription className="text-xs text-muted-foreground">
                    {t("send.form.amount.fee", {
                      ns: "dashboard",
                      amount: fNumber(totalFees.fixedValue + nativeGas, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      }),
                      code: "",
                    })}
                    {!!totalFees.percentValue && (
                      <>+ {fNumber(totalFees.percentValue, { maximumFractionDigits: 6 })}%</>
                    )}
                  </FormDescription>
                </div>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
