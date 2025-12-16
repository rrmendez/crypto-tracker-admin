import {
  getWalletsByDashboard,
  getClientsTotals,
  getWalletsBalancesByDashboard,
  getCurrenciesPrices,
  getTransactionsByDashboard,
} from "@/actions/dashboard";
import { CONFIG } from "@/config/global";
import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  /**
   * Get financial wallets by dashboard
   * @returns
   */
  const queryWallets = useQuery({
    queryKey: [CONFIG.queryIds.walletsDashboard],
    queryFn: () => getWalletsByDashboard(),
    staleTime: CONFIG.cacheDuration,
  });

  // Get clients totals
  const queryClients = useQuery({
    queryKey: [CONFIG.queryIds.clientsDashboard],
    queryFn: () => getClientsTotals(),
  });

  // Get wallets balances
  const queryWalletsBalances = useQuery({
    queryKey: [CONFIG.queryIds.balancesDashboard],
    queryFn: () => getWalletsBalancesByDashboard(),
  });

  // Get currencies prices
  const queryCurrenciesPrices = useQuery({
    queryKey: [CONFIG.queryIds.currenciesPrices],
    queryFn: () => getCurrenciesPrices(),
  });

  // Get transactions by dashboard
  const queryTransactions = useQuery({
    queryKey: [CONFIG.queryIds.transactionsDashboard],
    queryFn: () => getTransactionsByDashboard(),
  });

  return {
    queryWallets,
    queryClients,
    queryTransactions,
    queryWalletsBalances,
    queryCurrenciesPrices,
  };
}
