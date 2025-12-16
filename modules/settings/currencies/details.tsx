import { useCurrencies } from "@/hooks/use-currencies";
import { SkeletonCurrencyForm } from "./form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";
import { useTranslate } from "@/locales";
import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type Props = {
  currencyId: string;
};

export default function CurrencyDetails({ currencyId }: Props) {
  const { getCurrency, getTemplate, getCurrenciesPriceQuery } = useCurrencies();
  const router = useRouter();

  const { data: currency, isLoading } = getCurrency(currencyId);
  const { data: currencyTemplate } = getTemplate();
  const { data: currenciesPrice } = getCurrenciesPriceQuery(currencyId);

  const { t } = useTranslate(["currency"]);

  const formSchema = z.object({
    configId: z.string(),
    name: z.string(),
    decimals: z.union([z.number(), z.string()]),
    symbol: z.string(),
    logo: z.string(),
    price: z.union([z.number(), z.string()]),
    percentageAboveThePrice: z.string(),
  });

  const defaultValues = useMemo(() => {
    return {
      configId: currency?.configId ?? "",
      name: currency?.name ?? "",
      decimals: currency?.decimals ?? 2,
      symbol: currency?.symbol ?? "",
      logo: currency?.logo ?? "",
      price: currency?.price ?? "",
    };
  }, [currency]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { setValue, watch } = form;

  useEffect(() => {
    if (currency) {
      setValue("configId", currency.configId);
      setValue("name", currency.name);
      setValue("decimals", currency.decimals);
      setValue("symbol", currency.symbol ?? "");
      setValue("logo", currency.logo ?? "");
      setValue("price", currency.price);
    }
  }, [currency, setValue]);

  if (isLoading) {
    return <SkeletonCurrencyForm />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="border-b !pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t("cardTitle", { ns: "currency" })}</CardTitle>
            <CardDescription>{t("cardDescription", { ns: "currency" })}</CardDescription>
          </div>

          {currenciesPrice?.usdPrice && (
            <div className="text-right text-sm font-medium text-muted-foreground">
              <div className="text-xs uppercase">Precio</div>
              <div className="text-xs text-foreground">{currenciesPrice?.usdPrice} USD</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="configId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.config", { ns: "currency" })}:</FormLabel>
                    <Select value={field.value} disabled>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione una moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyTemplate?.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id} disabled>
                            {currency.code} - {currency.name}
                            {currency?.networkCode && ` (${currency.networkCode})`}
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
                    <FormLabel>{t("form.name", { ns: "currency" })}:</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} readOnly />
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
                      <FormLabel>{t("form.symbol", { ns: "currency" })}:</FormLabel>
                      <FormControl>
                        <Input placeholder="Símbolo" {...field} readOnly />
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
                      <FormLabel>{t("form.decimals", { ns: "currency" })}:</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Decimales" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {watch("price") && (
                <>
                  <Label>Precio fijo de la moneda en la plataforma:</Label>
                  <div className="grid gap-6 md:grid-cols-2 items-start">
                    <InputGroup>
                      <InputGroupInput value={form.watch("price")} readOnly />
                      <InputGroupAddon align="inline-end">USD</InputGroupAddon>
                    </InputGroup>
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push(paths.settings.currencies.root)}>
          Cerrar
        </Button>
      </CardFooter>
    </Card>
  );
}
