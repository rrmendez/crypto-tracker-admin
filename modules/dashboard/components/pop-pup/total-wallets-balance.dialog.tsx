"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { useTranslate } from "@/locales";
import { fCurrency } from "@/utils/format-number";
import { useDashboard } from "@/hooks/use-dashboard";

type TotalWalletsBalanceDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function TotalWalletsBalanceDialog({
  open,
  onClose,
}: TotalWalletsBalanceDialogProps) {
  const { t } = useTranslate(["dashboard"]);

  const { queryWalletsBalances } = useDashboard();
  const { data: walletsBalances } = queryWalletsBalances;

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
          {walletsBalances?.map((balance) => (
            <div
              key={balance.currencyId}
              className="flex justify-between items-center border-b border-gray-200 pb-2"
            >
              <div>
                <div className="font-medium">{balance.code}</div>
                <div className="text-sm text-gray-500">{balance.name}</div>
                <div className="text-xs text-primary">{balance.networkCode}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">
                  {t("feeAddress.balance", { ns: "dashboard" })}: {balance.balance}
                </div>
                <div className="text-sm text-gray-500">
                  {t("feeAddress.price", { ns: "dashboard" })}:{" "}
                  {fCurrency(balance.usdPrice, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </div>
                <div className="font-semibold text-primary">
                  {t("feeAddress.total", { ns: "dashboard" })}:{" "}
                  {fCurrency(balance.usdBalance, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
