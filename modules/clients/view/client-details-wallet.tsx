import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import WalletsTableHistoryOperations from "../wallets-table-history-operations";
import { useTranslate } from "@/locales";
import { useWallets } from "@/hooks/use-wallets";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { fNumber } from "@/utils/format-number";

export default function ClientDetailsWallet() {
  const { t } = useTranslate();
  const { walletId } = useParams();
  const { getWallet } = useWallets();
  const { data: wallet, isLoading } = getWallet(walletId as string);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            aria-label="Volver atrás"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">
            {t("transactions.details.detailsWallet")}
          </h1>
        </div>
      </div>
      <Card>
        <CardContent className="space-y-6">
          {isLoading ? (
            <WalletCardSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("transactions.details.currency")}
                </h3>
                <p className="font-bold tracking-tight">{wallet?.currency?.code}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("transactions.details.addressWallet")}
                </h3>
                <p className="font-bold tracking-tight break-words max-w-full">{wallet?.address}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("transactions.details.balanceWallet")}
                </h3>
                <p className="font-bold tracking-tight">
                  {fNumber(wallet?.balance, {
                    maximumFractionDigits: wallet?.currency.decimals,
                    minimumFractionDigits: wallet?.currency.decimals,
                  })}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("transactions.details.income")}
                </h3>
                <p className="font-bold tracking-tight">
                  {fNumber(wallet?.income, {
                    maximumFractionDigits: wallet?.currency.decimals,
                    minimumFractionDigits: wallet?.currency.decimals,
                  })}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("transactions.details.expense")}
                </h3>
                <p className="font-bold tracking-tight">
                  {fNumber(wallet?.expense, {
                    maximumFractionDigits: wallet?.currency.decimals,
                    minimumFractionDigits: wallet?.currency.decimals,
                  })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("transactions.title")}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <WalletsTableHistoryOperations />
        </CardContent>
      </Card>
    </div>
  );
}

function WalletCardSkeleton() {
  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </CardContent>
  );
}
