import { paths } from "@/routes/paths";
import packageJson from "../package.json";

// ----------------------------------------------------------------------

export type ConfigValue = {
  isStaticExport: boolean;
  site: {
    name: string;
    serverUrl: string;
    wsServerUrl: string;
    basePath: string;
    baseUrl: string;
    version: string;
  };
  auth: {
    defaultRedirect: string;
    cryptoKey: string;
  };
  firebase: {
    appId: string;
    apiKey: string;
    projectId: string;
    authDomain: string;
    storageBucket: string;
    measurementId: string;
    messagingSenderId: string;
  };
  defaultCurrency: { code: string; currency: string; symbol: string };
  stores: {
    google: string;
    apple: string;
  };
  cacheDuration: number;
  queryIds: {
    user: string;
    clients: string;
    currencies: string;
    currency: string;
    currencyTemplate: string;
    securityLogs: string;
    limits: string;
    limit: string;
    systemOperations: string;
    limitsByClient: string;
    users: string;
    countries: string;
    currencyPrice: string;
    fees: string;
    fee: string;
    walletsDashboard: string;
    clientsDashboard: string;
    balancesDashboard: string;
    currenciesPrices: string;
    transactionsDashboard: string;
    limitsWallet: string;
    prices: string;
    allPrices: string;

    transactions: string;
    wallets: string;
    nativeGas: string;
  };
  onesignal: {
    appId: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  site: {
    name: "Basspago | Admin",
    serverUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    wsServerUrl: process.env.NEXT_PUBLIC_WS_API ?? "",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "",
    version: packageJson.version,
  },
  isStaticExport: process.env.BUILD_STATIC_EXPORT === "true",
  auth: {
    defaultRedirect: paths.auth.login,
    cryptoKey: process.env.NEXT_PUBLIC_CRYPTO_KEY ?? "",
  },
  /**
   * Firebase
   */
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
  },
  defaultCurrency: {
    code: process.env.NEXT_PUBLIC_DEFAULT_NUMBER_FORMAT_CODE ?? "en-US",
    currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "USD",
    symbol: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY_SYMBOL ?? "$",
  },
  stores: {
    google: "",
    apple: "",
  },
  /**
   * React Query utils
   */
  cacheDuration: !!process.env.NEXT_PUBLIC_CACHE_DURATION
    ? +process.env.NEXT_PUBLIC_CACHE_DURATION
    : 60 * 60 * 24 * 365 * 10,
  queryIds: {
    user: "USER_PROFILE",
    clients: "CLIENTS_LIST",
    currencies: "CURRENCIES_LIST",
    currency: "CURRENCY",
    currencyTemplate: "CURRENCY_TEMPLATE",
    securityLogs: "SECURITY_LOGS",
    limits: "LIMITS_LIST",
    limit: "LIMIT",
    systemOperations: "SYSTEM_OPERATIONS_LIST",
    limitsByClient: "LIMITS_BY_CLIENT",
    users: "USERS_LIST",
    countries: "COUNTRIES_LIST",
    currencyPrice: "CURRENCY_PRICE",
    fees: "FEES_LIST",
    fee: "FEE",
    walletsDashboard: "WALLETS_DASHBOARD",
    clientsDashboard: "CLIENTS_DASHBOARD",
    balancesDashboard: "BALANCES_DASHBOARD",
    currenciesPrices: "CURRENCIES_PRICES",
    transactionsDashboard: "TRANSACTIONS_DASHBOARD",
    limitsWallet: "LIMIT_WALLET",
    prices: "PRICES",
    allPrices: "ALL_PRICES",

    wallets: "WALLETS_LIST",
    transactions: "TRANSACTIONS_LIST",
    nativeGas: "NATIVE_GAS",
  },
  onesignal: {
    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? "",
  },
};
