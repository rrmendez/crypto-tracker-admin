export type Currency = {
  balance?: number;
  id: string;
  code: string;
  name: string;
  type: "CRYPTO" | "FIAT" | "VIRTUAL";
  decimals: number;
  symbol: string;
  isToken: boolean;
  network: string;
  networkCode: string;
  explorerUrl: string;
  smartContractAddress: string;
  logo: string;
  isActive: boolean;
  configId: string;
  updatedAt: string;
  createdAt: string;
  price: number;
  usdPrice: number;
};

export type CreateCurrencyDto = {
  configId: string;
  name: string;
  decimals: number;
  symbol?: string;
  logo?: string;
  price?: number;
};

export type UpdateCurrencyDto = Partial<CreateCurrencyDto>;

export enum CurrencyTypeEnum {
  FIAT = "FIAT",
  VIRTUAL = "VIRTUAL",
  CRYPTO = "CRYPTO",
}

export interface CurrencyTemplate {
  id: string;
  code: string; // Ej: "tBNB"
  name: string; // Ej: "Binance Coin Testnet"
  type: CurrencyTypeEnum; // Ej: "FIAT"
  decimals: number; // Ej: 18
  isActive: boolean; // Ej: true
  network: string; // Ej: "bsc"
  networkCode: string; // Ej: "bep20"
}

export type Price = {
  id: string;
  network: string;
  usdPrice: number;
  code: string;
  usdPriceFormatted?: string;
  usdPrice24hr?: number;
  usdPrice24hrUsdChange?: number;
  usdPrice24hrPercentChange?: number;
  "24hrPercentChange"?: string;
};
