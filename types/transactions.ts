/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency } from "./currencies";
import { User } from "./profile";
import { Wallet } from "./wallets";

// ----------------------------------------------------------------------

export type Transaction = {
  id: string;
  type: TransactionType;
  wallet: Wallet;
  status: TransactionStatus;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  fee: string;
  creditedAmount: string;
  price: number;
  withdrawAmount: number;
  symbol: TransactionSymbol;
  currencyCode: string;
  extras?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  currency: Currency;
  user: User;
};

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  EXCHANGE = "EXCHANGE",
  SALE = "SALE",
  PAYMENT = "PAYMENT",
}

export enum TransactionStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
}

export enum TransactionSymbol {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

export type RequestWithdrawDto = {
  type: string;
  currencyId: string;
  amount: number;
  address: string;
  secondFactorCode: string;
};

export type AsyncFnResponse = {
  status: string;
};

export type NativeGasFee = {
  txCount: number;
  gasLimitPerTx: bigint;
  feePerGasWei: bigint;
  totalGasWei: bigint;
  totalGasNative: string;
  isEip1559: boolean;
};
