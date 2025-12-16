"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import GasProvider from "./components/gas-provider";
import FeeAddress from "./components/fee-address";
import ExchangeAddress from "./components/exchange-address";
import TotalValue from "./components/total-value";
import Distribution from "./components/distribution";
import Users from "./components/users";
import MarketBehavior from "./components/market-behavior";
import RecentTransactions from "./components/recent-transactions";
import { useMemo } from "react";

export default function DashboardView() {
  const { queryWallets } = useDashboard();

  // wallets
  const { data: wallets, isLoading: isLoadingWallets } = queryWallets;

  // gas provider wallet
  const gasProvider = useMemo(() => {
    return wallets?.find((wallet) => wallet.name === "Gas Provider");
  }, [wallets]);

  // fee address wallet
  const feeAddress = useMemo(() => {
    return wallets?.find((wallet) => wallet.name === "Fee Address");
  }, [wallets]);

  // exchange address wallet
  const exchangeAddress = useMemo(() => {
    return wallets?.find((wallet) => wallet.name === "Exchange Address");
  }, [wallets]);

  return (
    <div className="p-4 space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <TotalValue />
        <Distribution />
        <Users />
        <GasProvider gasProvider={gasProvider} loading={isLoadingWallets} />
        <FeeAddress feeAddress={feeAddress} loading={isLoadingWallets} />
        <ExchangeAddress exchangeAddress={exchangeAddress} loading={isLoadingWallets} />
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <MarketBehavior />
        <RecentTransactions />
      </div>
    </div>
  );
}
