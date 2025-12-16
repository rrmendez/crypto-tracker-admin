"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets } from "@/hooks/use-wallets";
import { useTranslate } from "@/locales";
import { TransactionSymbol } from "@/types";
import { fNumber } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type Props = {
  depositId: string;
  backPath: string;
};

export default function DepositsDetails({ depositId, backPath }: Props) {
  const { t } = useTranslate(["common", "transactions"]);
  const { getTransactionDetailsQuery } = useWallets();
  const router = useRouter();

  const { data: transactionDetails, isLoading, isError } = getTransactionDetailsQuery(depositId);
  const currency = transactionDetails?.currency;

  const explorerUrl = useMemo(
    () => currency?.explorerUrl ?? "https://testnet.bscscan.com",
    [currency]
  );

  const renderDetails = useMemo(() => {
    if (!transactionDetails) return null;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-medium">
            {t("depositsDetailsView.breadcrumb.deposit", { ns: "transactions" })}
          </h2>
          <h2 className="text-2xl font-medium">
            {transactionDetails.symbol === TransactionSymbol.NEGATIVE && "-"}
            {fNumber(transactionDetails.amount, { maximumFractionDigits: currency?.decimals })}{" "}
            {currency?.code}
          </h2>
          {transactionDetails.price && (
            <p className="text-sm">
              ~ $
              {fNumber(+transactionDetails.amount * transactionDetails.price, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            </p>
          )}
        </div>

        <Card className="border-0 bg-muted rounded-md p-3">
          <CardContent className="flex flex-col gap-3 p-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm  font-bold">{t("transactions.details.status")}:</span>
              <span className="text-sm">{t(`operations.status.${transactionDetails.status}`)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{t("transactions.details.currency")}:</span>
              <span className="text-sm">{transactionDetails.currencyCode}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{t("transactions.details.date")}:</span>
              <span className="text-sm">{fDateTime(transactionDetails.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted rounded-md p-3">
          <CardContent className="flex flex-col gap-3 p-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm  font-semibold">{t("transactions.details.sendBy")}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("transactions.details.sender")}:
              </span>
              <span className="text-sm break-all text-right">{transactionDetails.fromAddress}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted rounded-md p-3">
          <CardContent className="flex flex-col gap-3 p-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm  font-bold">{t("transactions.details.recivedBy")}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {t("transactions.details.email")}:
              </span>
              {/* TODO: field user.email? */}
              <span className="text-sm">{transactionDetails.user?.email}</span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t("transactions.details.destinationAddress")}:
              </span>
              <span className="text-sm break-all text-right">{transactionDetails.toAddress}</span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-muted-foreground  whitespace-nowrap">
                {t("transactions.details.txHash")}:
              </span>
              <span className="text-sm break-all text-right">{transactionDetails.txHash}</span>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="secondary"
          className="w-full font-normal"
          onClick={() => window.open(`${explorerUrl}/tx/${transactionDetails.txHash}`, "_blank")}
        >
          {t("transactions.details.moreDetails")}
          <ChevronRight className="ms-auto h-4 w-4" />
        </Button>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionDetails, currency]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent>
        {isLoading && <DepositDetailsSkeleton />}
        {isError && <div>Error loading transaction details.</div>}
        {!isLoading && !isError && renderDetails}
      </CardContent>
      <CardFooter>
        <div className="flex justify-end items-end w-full">
          <Button onClick={() => router.push(backPath)} variant="outline">
            Cerrar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function DepositDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>

      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-3 p-0">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-3 p-0">
          {[1, 2].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="secondary" className="w-full font-normal" disabled>
        <Skeleton className="h-4 w-28" />
        <ChevronRight className="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </div>
  );
}
