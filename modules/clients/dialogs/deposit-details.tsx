import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslate } from "@/locales";
import { Currency, Transaction, TransactionSymbol } from "@/types";
import { calculateGasCostInBNB } from "@/utils/crypto-currencies";
import { fNumber } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

// ----------------------------------------------------------------------

type Props = {
  deposit: Transaction;
  currency: Currency;
};

export function DepositDetails({ deposit, currency }: Props) {
  const { t } = useTranslate();

  const gasCost = useMemo(
    () =>
      calculateGasCostInBNB(
        deposit?.extras?.gasUsed,
        deposit?.extras?.gasPrice || ("100000000" as unknown as bigint)
      ),
    [deposit.extras?.gasUsed, deposit.extras?.gasPrice]
  );

  const gasCostInUSD = useMemo(() => +gasCost * 765, [gasCost]);

  const explorerUrl = useMemo(
    () => currency.explorerUrl ?? "https://testnet.bscscan.com",
    [currency]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-medium">
          {deposit.symbol === TransactionSymbol.NEGATIVE && "-"}
          {fNumber(deposit.amount, { maximumFractionDigits: currency.decimals })} {currency.code}
        </h2>
        {/*  <p className="text-sm">~ ${fNumber(+deposit.amount * 765, { maximumFractionDigits: 2 })}</p> */}
      </div>

      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-3 p-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{t("transactions.details.date")}:</span>
            <span className="text-sm">{fDateTime(deposit.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {t("transactions.details.status")}:
            </span>
            <span className="text-sm">{t(`operations.status.${deposit.status}`)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {t("transactions.details.sender")}:
            </span>
            <span className="text-sm break-all text-right">{deposit.fromAddress}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-3 p-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {t("transactions.details.networkFee")}:
            </span>
            <span className="text-sm">
              {gasCost} {currency.code} ($
              {fNumber(gasCostInUSD, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {t("transactions.details.block")}:
            </span>
            <span className="text-sm">{deposit?.extras?.blockNumber}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="secondary"
        className="w-full font-normal"
        onClick={() => window.open(`${explorerUrl}/tx/${deposit.txHash}`, "_blank")}
      >
        {t("transactions.details.moreDetails")}
        <ChevronRight className="ms-auto h-4 w-4" />
      </Button>
    </div>
  );
}
