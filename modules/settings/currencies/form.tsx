"use client";

import { useCurrencies } from "@/hooks/use-currencies";
import { useTranslate } from "@/locales";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getMessageError } from "@/utils/helper";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { useCallback, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

// ----------------------------------------------------------------------

type Props = {
  currencyId?: string;
};

export default function CurrencyForm({ currencyId }: Props) {
  const { getCurrency, getTemplate, create, update } = useCurrencies();

  const router = useRouter();

  const { t } = useTranslate(["currency", "commons", "errors"]);

  const { data: currency, isLoading } = getCurrency(currencyId);
  const { data: currencyTemplate, isLoading: isLoadingTemplate } = getTemplate();

  const formSchema = z.object({
    configId: z.string().min(1, { message: t("currencyForm.errors.configRequired") }),
    name: z
      .string()
      .min(1, { message: t("currencyForm.errors.nameRequired") })
      .max(100, { message: t("currencyForm.errors.nameTooLong") }),
    decimals: z
      .union([z.number(), z.string()])
      .refine((val) => !isNaN(+val), {
        message: t("currencyForm.errors.invalidDecimals"),
      })
      .refine((val) => +val >= 0 && +val <= 18, {
        message: t("currencyForm.errors.decimalRange"),
      }),
    symbol: z.string(),
    logo: z.string(),
    price: z
      .union([z.number(), z.string()])
      .optional()
      .refine(
        (val) => {
          if (val === undefined || val === null) return true;
          const num = typeof val === "number" ? val : Number(val);
          return !isNaN(num);
        },
        {
          message: t("currencyForm.errors.invalidPrice"),
        }
      ),
    percentageAboveThePrice: z.string().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      configId: currency?.configId ?? "",
      name: currency?.name ?? "",
      decimals: currency?.decimals ?? 2,
      symbol: currency?.symbol ?? "",
      logo: currency?.logo ?? "",
      price: currency?.price ?? "",
    }),
    [currency]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const values = watch();

  useEffect(() => {
    if (currency) {
      setValue("configId", currency.configId);
      setValue("name", currency.name);
      setValue("decimals", currency.decimals);
      setValue("symbol", currency.symbol ?? "");
      setValue("logo", currency.logo ?? "");
      setValue("price", currency.price ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formattedData = {
        ...values,
        decimals: +values.decimals,
        price: !!values.price ? +values.price : undefined,
      };

      if (currencyId) {
        await update.mutateAsync({ id: currencyId, data: formattedData });
      } else {
        await create.mutateAsync(formattedData);
      }

      router.push(paths.settings.currencies.root);
    } catch (error) {
      console.error(error);
      const description = getMessageError(error);
      toast.error(t("currencyForm.messages.errorTitle"), {
        description: t(description, { ns: "errors" }),
      });
    }
  };

  const handleChangeCurrency = useCallback(
    (id: string) => {
      if (id) {
        setValue("configId", id, { shouldValidate: true });
        const template = currencyTemplate?.find((currency) => currency.id === id);
        if (template) {
          setValue("name", template.name, { shouldValidate: true });
          setValue("decimals", template.decimals, { shouldValidate: true });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currencyTemplate, values, setValue]
  );

  if (isLoading) return <SkeletonCurrencyForm />;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <CardTitle>
          {currencyId ? t("currencyForm.cardTitle.edit") : t("currencyForm.cardTitle.create")}
        </CardTitle>
        <CardDescription>
          {currencyId
            ? t("currencyForm.cardDescription.edit")
            : t("currencyForm.cardDescription.create")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="configId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currencyForm.labels.config")}</FormLabel>
                    <Select
                      onValueChange={handleChangeCurrency}
                      value={field.value}
                      disabled={isLoadingTemplate || !!currencyId}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 w-full">
                          <SelectValue
                            placeholder={t("currencyForm.placeholders.selectCurrency")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyTemplate?.map((currency) => (
                          <SelectItem
                            key={currency.id}
                            value={currency.id}
                            disabled={!currency.isActive}
                          >
                            {currency.code} - {currency.name}
                            {currency?.network && ` (${currency.network})`}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currencyForm.labels.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("currencyForm.placeholders.name")}
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2 items-start">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("currencyForm.labels.symbol")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("currencyForm.placeholders.symbol")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="decimals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("currencyForm.labels.decimals")}</FormLabel>
                      <FormControl>
                        <Input
                          step={1}
                          min={0}
                          max={20}
                          placeholder={t("currencyForm.placeholders.decimals")}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(+value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Label>{t("currencyForm.labels.fixedPrice")}</Label>
              <div className="grid gap-6 md:grid-cols-2 items-start">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            placeholder={t("currencyForm.placeholders.price")}
                            {...field}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^\d*\.?\d*$/.test(v)) field.onChange(v || "");
                            }}
                            onBlur={() => {
                              const v = Number(field.value);
                              if (!isNaN(v)) field.onChange(v);
                            }}
                          />
                          <InputGroupAddon align="inline-end">USD</InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push(paths.settings.currencies.root)}>
          {t("currencyForm.buttons.cancel")}
        </Button>
        <Button disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {t("currencyForm.buttons.save")}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function SkeletonCurrencyForm() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </CardFooter>
    </Card>
  );
}
