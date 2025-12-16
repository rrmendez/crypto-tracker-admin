"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTranslate } from "@/locales";
import { fCurrency, fNumber } from "@/utils/format-number";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MarketBehavior() {
  const { t } = useTranslate("dashboard");
  const { queryCurrenciesPrices } = useDashboard();
  const { data: currenciesPrices } = queryCurrenciesPrices;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
            {t("marketBehavior.title", { ns: "dashboard" })}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full max-w-5xl border rounded-md overflow-hidden">
          <div className="grid grid-cols-3 items-center bg-muted/50 py-3 px-6 text-sm font-medium text-foreground">
            <span className="text-left">{t("marketBehavior.currency", { ns: "dashboard" })}</span>
            <span className="text-center">{t("marketBehavior.price", { ns: "dashboard" })}</span>
            <span className="text-right">{t("marketBehavior.variation", { ns: "dashboard" })}</span>
          </div>

          <div className="divide-y divide-border max-h-[420px] overflow-y-auto scrollableDiv">
            {currenciesPrices?.map((item) => {
              const isPositive = Number(item["24hrPercentChange"] ?? 0) >= 0;
              return (
                <div
                  key={`${item.code}-${item.network}`}
                  className="grid grid-cols-3 items-center py-3 px-6 text-sm hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-foreground">{item.code}</span>
                    <span className="text-muted-foreground">{t("network." + item.network)}</span>
                  </div>

                  <span className="font-semibold text-center text-foreground">
                    {fCurrency(item.usdPrice, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>

                  <div
                    className={`flex items-center justify-end gap-1 font-medium ${
                      isPositive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>
                      {fNumber(item["24hrPercentChange"] ?? 0, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                      %
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
