import { Currency } from "./currencies";
import { TransactionType } from "./transactions";

// ----------------------------------------------------------------------

export type Balances = {
  balance: string;
  currency: Currency;
};

export type Wallet = {
  id: string;
  balance: string;
  isDefault: boolean;
  address: string;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  card?: Card;
  expense?: string;
  income?: string;
  name?: string;
  balances?: Balances[];
};

export type Card = {
  id: string;
  name: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
};

export type TotalBalance = {
  currencyId: string;
  code: string;
  name: string;
  networkCode: string | null;
  usdPrice: string | null;
  balance: string;
  usdBalance: string;
};

export type WalletLimits = {
  minimumPerOperation: string;
  maximumPerOperation: string;
  maximumPerOperationAtNight: string;
  maximumPerMonth: string;
  maximumAllowed: string;
};

export type CurrencyPrice = {
  code: string;
  date: Date;
  usdPrice: string | number;
};

export type LatestPrice = {
  currencyId: string;
  code: string;
  network?: string;
  networkCode?: string;
  date: string;
  usdPrice: string;
  usdPriceFormatted?: string;
  usdPrice24hr?: string;
  usdPrice24hrUsdChange?: string;
  usdPrice24hrPercentChange?: string;
  "24hrPercentChange"?: string;
};

export type TotalTransactions = { type: TransactionType; totalAmount: number };
