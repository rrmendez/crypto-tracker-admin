"use client";

import { useEffect, useMemo } from "react";
import { useLimits } from "@/hooks/use-limits";
import { OperationType } from "@/types/limit";
import { SkeletonCurrencyForm } from "../currencies/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/locales";

type Props = {
  limitId?: string;
};

export default function LimitsDetails({ limitId }: Props) {
  const { t } = useTranslate(["limits"]);

  const { getSystemOperations, getLimit } = useLimits();
  const router = useRouter();

  const { data: systemOperations, isLoading: loadingOptions } = getSystemOperations();
  const { data: limit, isLoading } = getLimit(limitId);

  const isOptionsReady = !loadingOptions && systemOperations && systemOperations?.length > 0;

  const defaultValues = useMemo(() => {
    return {
      operation: (limit?.operation as OperationType) ?? "",
      currencyCode: "USD",
      minimumPerOperation: limit?.minimumPerOperation ?? 0,
      maximumPerOperation: limit?.maximumPerOperation ?? 0,
      maximumPerOperationAtNight: limit?.maximumPerOperationAtNight ?? 0,
      maximumPerOperationValidated: limit?.maximumPerOperationValidated ?? 0,
      maximumPerOperationAtNightValidated: limit?.maximumPerOperationAtNightValidated ?? 0,
      maximumPerMonth: limit?.maximumPerMonth ?? 0,
      maximumPerMonthValidated: limit?.maximumPerMonthValidated ?? 0,
    };
  }, [limit]);

  const form = useForm({
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    if (limit && isOptionsReady) {
      reset({
        operation: limit.operation as OperationType,
        currencyCode: "USD",
        minimumPerOperation: limit.minimumPerOperation ?? 0,
        maximumPerOperation: limit.maximumPerOperation ?? 0,
        maximumPerOperationAtNight: limit.maximumPerOperationAtNight ?? 0,
        maximumPerOperationValidated: limit.maximumPerOperationValidated ?? 0,
        maximumPerOperationAtNightValidated: limit.maximumPerOperationAtNightValidated ?? 0,
        maximumPerMonth: limit.maximumPerMonth ?? 0,
        maximumPerMonthValidated: limit.maximumPerMonthValidated ?? 0,
      });
    }
  }, [limit, isOptionsReady, reset]);

  if (isLoading || !isOptionsReady) {
    return <SkeletonCurrencyForm />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <CardTitle>{t("title.LimitsDetails")}</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.operation.LimitsDetails")}</FormLabel>
                    <Select disabled value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("placeholder.selectOperation.LimitsDetails")}
                          />
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currencyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.currency.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minimumPerOperation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.minPerOp.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <h3 className="text-sm font-bold">{t("section.unverifiedUsers.LimitsDetails")}</h3>
              <FormField
                control={form.control}
                name="maximumPerOperation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.maxDay.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maximumPerOperationAtNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.maxNight.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maximumPerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.maxMonth.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <h3 className="text-sm font-bold">{t("section.verifiedUsers.LimitsDetails")}</h3>
              <FormField
                control={form.control}
                name="maximumPerOperationValidated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.maxDayValidated.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maximumPerOperationAtNightValidated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.maxNightValidated.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maximumPerMonthValidated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.maxMonthValidated.LimitsDetails")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={Number(field.value) === -1 ? t("unlimited") : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push(paths.settings.limits.root)}>
          {t("button.close.LimitsDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
}
