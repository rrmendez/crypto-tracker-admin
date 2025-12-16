"use client";

import { Button } from "@/components/ui/button";
import { useTranslate } from "@/locales";
import { Wallet } from "@/types";
import { QrCode, Send, WalletCards } from "lucide-react";
import { useBoolean } from "@/hooks/use-boolean";
import { fNumber } from "@/utils/format-number";
import FinancialWalletsSkeleton from "./financial-wallets-skeleton";
import DepositFoundDialog from "./pop-pup/deposit-found.dialog";
import WalletsBalanceDialog from "./pop-pup/wallets-balance.dialog";
import WithdrawFoundDialog from "./pop-pup/withdraw-found.dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type GasProviderProps = {
  gasProvider?: Wallet;
  loading?: boolean;
};

export default function GasProvider({ gasProvider, loading }: GasProviderProps) {
  const { t } = useTranslate(["dashboard"]);

  const openDetails = useBoolean();
  const openQrCode = useBoolean();
  const openWithdraw = useBoolean();

  if (loading) {
    return <FinancialWalletsSkeleton />;
  }

  if (!gasProvider) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">{t("gasProvider.noWallet", { ns: "dashboard" })}</p>
      </div>
    );
  }

  const totalBalance = (gasProvider.balances ?? []).reduce((acc, { balance, currency }) => {
    const price = Number(currency?.usdPrice ?? 0);
    const amount = Number(balance ?? 0);
    return acc + amount * price;
  }, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
              {t("gasProvider.title", { ns: "dashboard" })}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">
            {t("gasProvider.balance", { ns: "dashboard" })}
          </p>
          <div className="text-3xl md:text-4xl font-semibold">
            <span className="text-3xl font-bold text-primary">
              {fNumber(totalBalance, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 items-center justify-center">
          <Button size="icon" variant="outline" onClick={openQrCode.onTrue}>
            <QrCode size={20} />
          </Button>
          <Button size="icon" variant="outline" onClick={openDetails.onTrue}>
            <WalletCards size={20} />
          </Button>
          <Button size="icon" variant="outline" onClick={openWithdraw.onTrue}>
            <Send size={20} />
          </Button>
        </CardFooter>
      </Card>
      <DepositFoundDialog
        open={openQrCode.value}
        onClose={openQrCode.onFalse}
        financialWallet={gasProvider}
      />

      <WalletsBalanceDialog
        open={openDetails.value}
        onClose={openDetails.onFalse}
        financialWallet={gasProvider}
      />

      <WithdrawFoundDialog
        open={openWithdraw.value}
        onClose={openWithdraw.onFalse}
        wallet={gasProvider}
        type="GAS"
      />
    </>
  );
}
