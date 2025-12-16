"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Currency, Wallet } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Trans } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { getCurrencyLogo } from "@/utils/crypto-currencies";
import QrCodeViewer from "@/components/qr-code-viewer";
import { CopyButton } from "@/components/animate-ui/buttons/copy";
import { useTranslate } from "@/locales";

type DepositFoundDialogProps = {
  open: boolean;
  onClose: () => void;
  financialWallet?: Wallet;
};

export default function DepositFoundDialog({
  open,
  onClose,
  financialWallet,
}: DepositFoundDialogProps) {
  const { t } = useTranslate(["dashboard"]);

  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>();

  const balances = useMemo(() => financialWallet?.balances ?? [], [financialWallet?.balances]);

  useEffect(() => {
    if (open && balances.length > 0) {
      const currency = balances[0].currency;
      setSelectedCurrency(currency);
    }

    return () => {
      setSelectedCurrency(undefined);
    };
  }, [balances, open]);

  const handleCurrencyChange = useCallback(
    (code: string) => {
      const currency = balances.find(
        (b) => `${b.currency.code}-${b.currency.network}` === code
      )?.currency;
      setSelectedCurrency(currency);
    },
    [balances]
  );

  const Logo = useMemo(
    () => getCurrencyLogo(selectedCurrency?.code ?? ""),
    [selectedCurrency?.code]
  );

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("dialogs.deposit", { ns: "dashboard" })}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Select
          value={selectedCurrency ? `${selectedCurrency.code}-${selectedCurrency.network}` : ""}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger id="currency" className="w-full">
            <SelectValue placeholder={t("gasProvider.placeholder.currency", { ns: "dashboard" })} />
          </SelectTrigger>

          <SelectContent>
            {balances.map(({ currency }) => (
              <SelectItem
                key={`${currency.code}-${currency.network}`}
                value={`${currency.code}-${currency.network}`}
              >
                {currency.code} ({t("network." + currency.network)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCurrency && (
          <div className="flex flex-col gap-6">
            <Alert className="bg-amber-100/40 text-amber-600 dark:bg-amber-900 dark:text-amber-500 shadow-lg border-0 max-w-md mx-auto">
              <Info />
              <AlertDescription>
                <p>
                  <Trans
                    ns="dashboard"
                    i18nKey="gasProvider.alert"
                    components={[
                      <span key={0} className="font-semibold">
                        {selectedCurrency.name} ({selectedCurrency.network})
                      </span>,
                    ]}
                  />
                </p>
              </AlertDescription>
            </Alert>
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto flex-1">
              <div className="flex items-center justify-center gap-2 w-full">
                <Logo className="w-8 h-8 rounded-full" />
                <h4 className="text-2xl font-semibold">{selectedCurrency.code}</h4>
                <Badge variant="secondary" className="rounded-full">
                  {selectedCurrency.network.toUpperCase()}
                </Badge>
              </div>
              <QrCodeViewer
                value={`${financialWallet?.address}`}
                isLoading={!financialWallet?.address}
              />
              <div className="flex items-center justify-center space-x-2 max-w-60">
                <p
                  className="text-muted-foreground text-sm text-center overflow-auto"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {financialWallet?.address}
                </p>
              </div>
              <CopyButton variant="secondary" size="md" content={financialWallet?.address} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
