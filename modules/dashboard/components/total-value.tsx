import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/use-dashboard";
import { fNumber } from "@/utils/format-number";
import { useMemo } from "react";
import FinancialWalletsSkeleton from "./financial-wallets-skeleton";
import { WalletCards } from "lucide-react";
import { useBoolean } from "@/hooks/use-boolean";
import TotalWalletsBalanceDialog from "./pop-pup/total-wallets-balance.dialog";
import SecretKeyDialog from "./pop-pup/secret-key.dialog";
import { useTranslate } from "@/locales";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function TotalValue() {
  const openDetails = useBoolean();
  const openKey = useBoolean();
  const { t } = useTranslate(["dashboard"]);

  const { queryWalletsBalances } = useDashboard();

  const { data: walletsBalances, isLoading: isLoadingWalletsBalances } = queryWalletsBalances;

  // total balances
  const totals = useMemo(() => {
    if (!walletsBalances) return 0;

    return walletsBalances.reduce((acc, item) => acc + +item.usdBalance, 0);
  }, [walletsBalances]);

  if (isLoadingWalletsBalances) {
    return <FinancialWalletsSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
              {t("totalValue.title", { ns: "dashboard" })}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">
            {t("totalValue.balance", { ns: "dashboard" })}
          </p>
          <div className="text-3xl md:text-4xl font-semibold">
            <span className="text-3xl font-bold text-primary">
              {fNumber(totals, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          {/*  <Button size="icon" variant="outline" onClick={openKey.onTrue}>
            <Key size={20} />
          </Button> */}
          <Button size="icon" variant="outline" onClick={openDetails.onTrue}>
            <WalletCards size={20} />
          </Button>
        </CardFooter>
      </Card>
      <TotalWalletsBalanceDialog open={openDetails.value} onClose={openDetails.onFalse} />
      <SecretKeyDialog open={openKey.value} onClose={openKey.onFalse} />
    </>
  );
}
