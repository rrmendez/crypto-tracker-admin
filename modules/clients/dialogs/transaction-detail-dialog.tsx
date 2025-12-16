"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { Transaction, TransactionType } from "@/types";
import { useMemo } from "react";
import { DepositDetails } from "./deposit-details";
import { WithdrawDetails } from "./withdraw-details";
import ExchangeSaleDetails from "./exchange-sale-details";
import { useTranslate } from "@/locales";
import { useWallets } from "@/hooks/use-wallets";

interface TransactionDetailDialogProps {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailDialog({
  transaction,
  open,
  onClose,
}: TransactionDetailDialogProps) {
  const { t } = useTranslate(["history"]);
  const { getTransactionDetailsQuery } = useWallets();

  const {
    data: transactionDetails,
    isLoading,
    isError,
  } = getTransactionDetailsQuery(transaction.id);

  const renderDetails = useMemo(() => {
    if (!transactionDetails) return null;

    switch (transactionDetails.type) {
      case TransactionType.DEPOSIT:
        return (
          <DepositDetails deposit={transactionDetails} currency={transactionDetails.currency} />
        );
      case TransactionType.WITHDRAW:
        return (
          <WithdrawDetails withdraw={transactionDetails} currency={transactionDetails.currency} />
        );
      default:
        return (
          <ExchangeSaleDetails
            transaction={transactionDetails}
            currency={transactionDetails.currency}
          />
        );
    }
  }, [transactionDetails]);

  return (
    <Dialog open={open} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t(`operations.type.${transaction.type}`, { ns: "history" })}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading transaction details.</div>}
        {!isLoading && !isError && renderDetails}
      </DialogContent>
    </Dialog>
  );
}
