"use client";

import { useLimits } from "@/hooks/use-limits";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SkeletonCurrencyForm } from "../currencies/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { getMessageError } from "@/utils/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@/locales";
import { NumericFormat } from "react-number-format";
import { CurrencyInput } from "@/components/currency-input";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  limitId?: string;
};

export default function LimitsForm({ limitId }: Props) {
  const router = useRouter();
  const { t } = useTranslate(["limits"]);

  const [unlimitedFields, setUnlimitedFields] = useState<Record<string, boolean>>({
    minimumPerOperation: false,
    maximumPerOperation: false,
    maximumPerOperationAtNight: false,
    maximumPerOperationValidated: false,
    maximumPerOperationAtNightValidated: false,
    maximumPerMonth: false,
    maximumPerMonthValidated: false,
  });

  const { getSystemOperations, getLimit, create, update } = useLimits();

  const { data: systemOperations, isLoading: loadingOptions } = getSystemOperations();

  const { data: limit, isLoading } = getLimit(limitId);

  const numericField = z
    .union([z.string(), z.number()])
    .refine(
      (val) => {
        const str = String(val).trim();
        return str !== "";
      },
      { message: t("errorEmpty") }
    )
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num);
      },
      { message: "Número inválido" }
    )
    .refine(
      (val) => {
        const num = Number(val);
        return num === -1 || num >= 0;
      },
      { message: t("errorEmpty") }
    );

  const formSchema = z.object({
    operation: z.string().min(1, { message: t("operationEmpty") }),
    currencyCode: z.string().min(1, { message: t("currencyEmpty") }),
    minimumPerOperation: numericField,
    maximumPerOperation: numericField,
    maximumPerOperationAtNight: numericField,
    maximumPerOperationValidated: numericField,
    maximumPerOperationAtNightValidated: numericField,
    maximumPerMonth: numericField,
    maximumPerMonthValidated: numericField,
  });

  const defaultValues = useMemo(
    () => ({
      operation: limit?.operation ?? "",
      currencyCode: "USD",
      minimumPerOperation: limit?.minimumPerOperation ?? "",
      maximumPerOperation: limit?.maximumPerOperation ?? "",
      maximumPerOperationAtNight: limit?.maximumPerOperationAtNight ?? "",
      maximumPerOperationValidated: limit?.maximumPerOperationValidated ?? "",
      maximumPerOperationAtNightValidated: limit?.maximumPerOperationAtNightValidated ?? "",
      maximumPerMonth: limit?.maximumPerMonth ?? "",
      maximumPerMonthValidated: limit?.maximumPerMonthValidated ?? "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit, limitId]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    setValue,
    formState: { isSubmitting },
  } = form;

  const updateFields = useCallback(async () => {
    if (limit) {
      setTimeout(async () => {
        setValue("operation", limit.operation);
        setValue("currencyCode", "USD");
        setValue("minimumPerOperation", limit.minimumPerOperation);
        setValue("maximumPerOperation", limit.maximumPerOperation);
        setValue("maximumPerOperationAtNight", limit.maximumPerOperationAtNight);
        setValue("maximumPerOperationValidated", limit.maximumPerOperationValidated);
        setValue("maximumPerOperationAtNightValidated", limit.maximumPerOperationAtNightValidated);
        setValue("maximumPerMonth", limit.maximumPerMonth);
        setValue("maximumPerMonthValidated", limit.maximumPerMonthValidated);

        setUnlimitedFields({
          minimumPerOperation: limit.minimumPerOperation == +"-1.00",
          maximumPerOperation: limit.maximumPerOperation == +"-1.00",
          maximumPerOperationAtNight: limit.maximumPerOperationAtNight == +"-1.00",
          maximumPerOperationValidated: limit.maximumPerOperationValidated == +"-1.00",
          maximumPerOperationAtNightValidated:
            limit.maximumPerOperationAtNightValidated == +"-1.00",
          maximumPerMonth: limit.maximumPerMonth == +"-1.00",
          maximumPerMonthValidated: limit.maximumPerMonthValidated == +"-1.00",
        });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  useEffect(() => {
    updateFields();
  }, [updateFields]);

  if (isLoading) {
    return <SkeletonCurrencyForm />;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const processedValues = {
        ...values,
        minimumPerOperation: unlimitedFields.minimumPerOperation ? -1 : +values.minimumPerOperation,
        maximumPerOperation: unlimitedFields.maximumPerOperation ? -1 : +values.maximumPerOperation,
        maximumPerOperationAtNight: unlimitedFields.maximumPerOperationAtNight
          ? -1
          : +values.maximumPerOperationAtNight,
        maximumPerOperationValidated: unlimitedFields.maximumPerOperationValidated
          ? -1
          : +values.maximumPerOperationValidated,
        maximumPerOperationAtNightValidated: unlimitedFields.maximumPerOperationAtNightValidated
          ? -1
          : +values.maximumPerOperationAtNightValidated,
        maximumPerMonth: unlimitedFields.maximumPerMonth ? -1 : +values.maximumPerMonth,
        maximumPerMonthValidated: unlimitedFields.maximumPerMonthValidated
          ? -1
          : +values.maximumPerMonthValidated,
      };

      if (limitId) {
        await update.mutateAsync({
          id: limitId,
          data: processedValues,
        });
      } else {
        await create.mutateAsync(processedValues);
        router.push(paths.settings.limits.root);
      }

      router.push(paths.settings.limits.root);
    } catch (error) {
      console.error(error);
      const description = getMessageError(error);
      toast.error(t(description));
    }
  };

  type UnlimitedCurrencyFieldProps = {
    name: keyof z.infer<typeof formSchema>;
    label: string;
    placeholder?: string;
  };

  const UnlimitedCurrencyField = ({ name, label, placeholder }: UnlimitedCurrencyFieldProps) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const isUnlimited = unlimitedFields[name];

        return (
          <FormItem>
            <FormLabel className="font-normal">{label}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-3">
                <NumericFormat
                  customInput={CurrencyInput}
                  currency="USD"
                  thousandSeparator=" "
                  decimalSeparator="."
                  value={isUnlimited ? "" : field.value}
                  onValueChange={(values) => {
                    if (!isUnlimited) field.onChange(values.value);
                  }}
                  placeholder={placeholder}
                  disabled={isUnlimited}
                  className="flex-1"
                />

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={isUnlimited}
                    onCheckedChange={(checked) => {
                      const isChecked = Boolean(checked);
                      setUnlimitedFields((prev) => ({ ...prev, [name]: isChecked }));
                      field.onChange(isChecked ? "-1" : "");
                    }}
                  />
                  {t("unlimited")}
                </label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <CardTitle>{limitId ? t("title.edit.LimitsForm") : t("title.new.LimitsForm")}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">{t("field.operation.LimitsForm")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingOptions || !!limitId}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 w-full">
                          <SelectValue placeholder={t("placeholder.selectOperation.LimitsForm")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {systemOperations?.map((operation) => (
                          <SelectItem key={String(operation)} value={String(operation)}>
                            {t(`operations.${operation}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currencyCode"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">{t("field.currency.LimitsForm")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite el nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <UnlimitedCurrencyField
                name="minimumPerOperation"
                label={t("field.minPerOp.LimitsForm")}
              />

              <h3 className="text-sm font-bold border-b pb-2">
                {t("section.unverified.LimitsForm")}
              </h3>
              <UnlimitedCurrencyField
                name="maximumPerOperation"
                label={t("field.maxDay.LimitsForm")}
              />

              <UnlimitedCurrencyField
                name="maximumPerOperationAtNight"
                label={t("field.maxNight.LimitsForm")}
              />

              <UnlimitedCurrencyField
                name="maximumPerMonth"
                label={t("field.maxMonth.LimitsForm")}
              />

              <h3 className="text-sm font-bold border-b pb-2">
                {t("section.verified.LimitsForm")}
              </h3>
              <UnlimitedCurrencyField
                name="maximumPerOperationValidated"
                label={t("field.maxDayValidated.LimitsForm")}
              />

              <UnlimitedCurrencyField
                name="maximumPerOperationAtNightValidated"
                label={t("field.maxNightValidated.LimitsForm")}
              />

              <UnlimitedCurrencyField
                name="maximumPerMonthValidated"
                label={t("field.maxMonthValidated.LimitsForm")}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push(paths.settings.limits.root)}>
          {t("button.cancel.LimitsForm")}
        </Button>
        <Button disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {t("button.save.LimitsForm")}
        </Button>
      </CardFooter>
    </Card>
  );
}
