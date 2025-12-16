import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTranslate } from "@/locales";
import { TransactionType } from "@/types";
import { fCurrency } from "@/utils/format-number";
import { useMemo } from "react";

export default function RecentTransactions() {
  const { t } = useTranslate(["dashboard"]);

  const { queryTransactions } = useDashboard();
  const { data: transactions } = queryTransactions;

  const filteredList = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((item) =>
      [TransactionType.DEPOSIT, TransactionType.WITHDRAW, TransactionType.EXCHANGE].includes(
        item.type
      )
    );
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
            {t("recentTransactions.title", { ns: "dashboard" })}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full max-w-5xl ">
          <div className="divide-y divide-border">
            {filteredList.map((item) => {
              return (
                <div
                  key={item.type}
                  className="grid grid-cols-2 items-center py-4 px-6 text-sm hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-left text-foreground">
                    {t(`operations.type.${item.type}`)}
                  </span>

                  <span className="font-semibold text-end text-foreground">
                    {fCurrency(item.totalAmount, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
