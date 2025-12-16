"use client";

import { Wallet } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { useTranslate } from "@/locales";
import { fCurrency, fNumber } from "@/utils/format-number";

type WalletsBalanceDialogProps = {
  open: boolean;
  onClose: () => void;
  financialWallet?: Wallet;
};

export default function WalletsBalanceDialog({
  open,
  onClose,
  financialWallet,
}: WalletsBalanceDialogProps) {
  const { t } = useTranslate(["dashboard"]);

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("dialogs.balance", { ns: "dashboard" })}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 scrollableDiv">
          {financialWallet?.balances?.map(({ currency, balance }, i) => {
            const amount = Number(balance);
            const price = Number(currency?.usdPrice ?? 0);
            const total = amount * price;

            return (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <div>
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-sm text-gray-500">{currency.name}</div>
                  <div className="text-xs text-primary">{currency.networkCode}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    {t("feeAddress.balance", { ns: "dashboard" })}:{" "}
                    {fNumber(amount, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: currency.decimals ?? 8,
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("feeAddress.price", { ns: "dashboard" })}:{" "}
                    {fCurrency(price, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="font-semibold text-primary">
                    {t("feeAddress.total", { ns: "dashboard" })}:{" "}
                    {fCurrency(total, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
