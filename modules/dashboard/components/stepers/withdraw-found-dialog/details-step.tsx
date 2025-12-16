import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslate } from "@/locales";
import { Currency } from "@/types";
import { fCurrency, fNumber } from "@/utils/format-number";
import Decimal from "decimal.js";

interface DetailsStepProps {
  onBack: (step: string) => void;
  onNext: (step: string) => void;
  to: string;
  amount: number | string;
  nativeGas: number;
  currency?: Currency;
  currencyPrice?: { usdPrice: number };
  fee: number;
  decimals: number;
}

export default function DetailsStep({
  onBack,
  onNext,
  to,
  amount,
  currency,
  nativeGas,
  currencyPrice,
  fee,
  decimals,
}: DetailsStepProps) {
  const { t } = useTranslate(["dashboard"]);

  return (
    <Card className="bg-background border-0">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm text-muted-foreground  whitespace-nowrap">
            {t("send.form.to.root", { ns: "dashboard" })}:
          </span>
          <span className="text-sm break-all text-right">{to}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("send.form.amount.root", { ns: "dashboard" })}:
          </span>
          <span className="text-sm">
            {fNumber(+amount, {
              maximumFractionDigits: decimals,
            })}{" "}
            {currency?.code}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("send.form.amount.feeLabel", { ns: "dashboard" })}:
          </span>
          <span className="text-sm">
            {!!currencyPrice && (
              <span className="text-muted-foreground">
                (~
                {fCurrency(
                  new Decimal(currencyPrice.usdPrice)
                    .times(fee + nativeGas)
                    .toDecimalPlaces(2)
                    .toNumber()
                )}
                )
              </span>
            )}
            {fNumber(fee + nativeGas, {
              maximumFractionDigits: decimals,
            })}
            {currency?.code}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("send.form.amount.amountDiscounted", { ns: "dashboard" })}:
          </span>
          <span className="text-sm">
            {fNumber(+amount + fee, {
              maximumFractionDigits: decimals,
            })}{" "}
            {currency?.code}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => onBack("information")}>
          {t("whithdraw.detailsStep.back", { ns: "dashboard" })}
        </Button>
        <Button onClick={() => onNext("code")}>
          {t("send.form.actions.confirm", { ns: "dashboard" })}
        </Button>
      </CardFooter>
    </Card>
  );
}
