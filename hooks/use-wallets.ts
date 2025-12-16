import {
  getCurrencyPrice,
  getTransactionDetails,
  getWalletDetails,
  getWalletHistory,
  getWalletLimits,
  getWalletsByClients,
  getWalletsPrices,
} from "@/actions/wallets";
import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import { PaginationRequest } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/* eslint-disable react-hooks/rules-of-hooks */
export function useWallets() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const getWalletsByClientsQuery = (userId: string, params: PaginationRequest) =>
    useQuery({
      queryKey: ["wallets-by-client", userId, params],
      queryFn: () => getWalletsByClients(userId, params),
      placeholderData: keepPreviousData,
      enabled: !!userId && userId.length > 0,
    });

  const getWalletHistoryQuery = (params: PaginationRequest) =>
    useQuery({
      queryKey: ["wallet-history", params],
      queryFn: () => getWalletHistory(params),
      placeholderData: keepPreviousData,
    });

  const getTransactionDetailsQuery = (id: string) =>
    useQuery({
      queryKey: ["transaction-details", id],
      queryFn: () => getTransactionDetails(id),
      placeholderData: keepPreviousData,
      enabled: !!id,
    });

  const getWallet = (walletId: string) =>
    useQuery({
      queryKey: ["wallet", walletId],
      queryFn: () => getWalletDetails(walletId),
      placeholderData: keepPreviousData,
      enabled: !!walletId,
    });

  /**
   * Get wallet limits
   *
   * @param walletId
   * @param operation
   * @returns
   */
  const getLimits = (walletId: string, operation: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.limitsWallet, walletId, operation],
      queryFn: async () => getWalletLimits({ operation, walletId }),
      enabled: !!walletId && !!operation,
    });

  /**
   * Get currency price
   *
   * @param currencyId
   * @returns
   */
  const getPrice = (currencyId: string) =>
    useQuery({
      queryKey: [CONFIG.queryIds.prices, currencyId],
      queryFn: async () => getCurrencyPrice(currencyId),
      enabled: !!currencyId,
      staleTime: 60 * 1000,
    });

  // get all prices
  const getPrices = useQuery({
    queryKey: [CONFIG.queryIds.allPrices],
    queryFn: async () => getWalletsPrices(),
    enabled: !!isLoggedIn,
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    getWalletsByClientsQuery,
    getWalletHistoryQuery,
    getTransactionDetailsQuery,
    getWallet,
    getLimits,
    getPrice,
    getPrices,
  };
}
