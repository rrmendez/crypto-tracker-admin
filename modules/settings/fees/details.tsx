"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@/locales";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useMemo } from "react";
import { useFees } from "@/hooks/use-fees"; // Supuesto
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { useCurrencies } from "@/hooks/use-currencies";
import { UpdateFeeDto } from "@/types/fees";
import { NumericFormat } from "react-number-format";
import { NumberInput } from "@/components/number-input";
import z from "zod";
import { SkeletonCurrencyForm } from "../currencies/form";
import { Label } from "@/components/ui/label";

type Props = {
  feeId?: string;
};

const operationOptions = [
  { label: "Depósito", value: "DEPOSIT" },
  { label: "Retiro", value: "WITHDRAW" },
  { label: "Cambio", value: "EXCHANGE" },
  { label: "Venta", value: "SALE" },
  { label: "Pago", value: "PAYMENT" },
];

const typeOptions = [
  { label: "Fijo", value: "FIXED" },
  { label: "Porcentaje", value: "PERCENT" },
];

export default function FeesDetails({ feeId }: Props) {
  const { t } = useTranslate(["fees"]);
  const router = useRouter();

  const { getCurrenciesSystem } = useCurrencies();

  const { getFeeByIdQuery } = useFees();
  const { data: currencies } = getCurrenciesSystem();
  const { data: fee, isLoading } = getFeeByIdQuery(feeId);

  const feeSchema = z.object({
    currencyId: z.string().optional(),
    operation: z.string().min(1, { message: t("form.selectOperation") }),
    type: z.string().min(1, { message: t("form.selectType") }),
    value: z.union([z.number(), z.string()]).refine(
      (val) => {
        if (val === undefined || val === null) return true;
        const num = typeof val === "number" ? val : Number(val);
        return !isNaN(num);
      },
      {
        message: "El valor no es un número válido",
      }
    ),
    isActive: z.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      operation: fee?.operation ?? "",
      type: fee?.type ?? "",
      value: fee?.value ?? "",
      isActive: fee?.isActive ?? true,
      currencyId: fee?.currency?.id ?? "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fee, feeId]
  );

  const form = useForm<UpdateFeeDto>({
    resolver: zodResolver(feeSchema),
    defaultValues,
  });

  const { setValue, watch } = form;
  const type = watch("type");

  const updateFields = useCallback(async () => {
    if (fee) {
      setTimeout(async () => {
        setValue("currencyId", fee.currency?.id);
        setValue("operation", fee.operation);
        setValue("type", fee.type);
        setValue("value", fee.value);
        setValue("isActive", fee.isActive);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fee]);

  useEffect(() => {
    updateFields();
  }, [updateFields]);

  if (isLoading) return <SkeletonCurrencyForm />;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b">
        <CardTitle>Detalles</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.operation")}</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("form.selectOperation")} />
                        </SelectTrigger>
                        <SelectContent>
                          {operationOptions.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {t(`operationsOptions.${op.value}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold ">{t("form.currency")}</FormLabel>
                    <FormControl>
                      <Select disabled value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder={t("form.selectCurrency")} />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies?.map((cur) => (
                            <SelectItem key={cur.id} value={cur.id}>
                              {cur.name} ({cur.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.type")}</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("form.selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {t(`typeOptions.${type.value}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.value")}</FormLabel>
                    <FormControl className="w-full">
                      {type === "FIXED" ? (
                        <NumericFormat
                          customInput={NumberInput}
                          thousandSeparator=" "
                          decimalSeparator="."
                          decimalScale={8}
                          allowNegative={false}
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.value);
                          }}
                          decimal={8}
                          disabled
                        />
                      ) : (
                        <NumericFormat
                          customInput={NumberInput}
                          thousandSeparator=" "
                          decimalSeparator="."
                          decimalScale={2}
                          allowNegative={false}
                          value={field.value}
                          onValueChange={(values) => {
                            field.onChange(values.value);
                          }}
                          decimal={2}
                          disabled
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <Label>Creado por</Label>
                <p className="text-sm ">{fee?.createdBy}</p>
              </div>
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <div className="space-y-0.5">
                    <FormLabel>{t("form.active")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push(paths.settings.fees.root)}
        >
          {t("form.close")}
        </Button>
      </CardFooter>
    </Card>
  );
}
