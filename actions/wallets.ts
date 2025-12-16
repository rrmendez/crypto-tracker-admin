import { PaginationRequest, PaginationResponse, Transaction } from "@/types";
import { CurrencyPrice, LatestPrice, Wallet, WalletLimits } from "@/types/wallets";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Get wallets list
 *************************************** */
export const getWalletsList = async (
  params: PaginationRequest
): Promise<PaginationResponse<Wallet>> => {
  try {
    const res = await axios.get(endpoints.wallets.list, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting wallets list:", error);
    throw error;
  }
};

/** **************************************
 * Get wallet details
 *************************************** */
export const getWalletDetails = async (id: string): Promise<Wallet> => {
  try {
    const res = await axios.get(endpoints.wallets.details(id));
    return res.data;
  } catch (error) {
    console.error("Error getting wallet details:", error);
    throw error;
  }
};

/** **************************************
 * Create wallets
 *************************************** */
export const createWallets = async (userId: string): Promise<Wallet[]> => {
  try {
    const res = await axios.post(endpoints.wallets.create(userId));
    return res.data;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
};

/** **************************************
 * Get wallets by user
 *************************************** */
export const getWalletsByClients = async (
  userId: string,
  params: PaginationRequest
): Promise<PaginationResponse<Wallet[]>> => {
  try {
    const res = await axios.get(endpoints.wallets.walletsByUser(userId), {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting wallets by user:", error);
    throw error;
  }
};

/** **************************************
 * History of Operations for a Wallet
 *************************************** */
export const getWalletHistory = async (
  params: PaginationRequest
): Promise<PaginationResponse<Transaction>> => {
  try {
    const res = await axios.get(endpoints.transactions.history, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting wallet history:", error);
    throw error;
  }
};

/** **************************************
 * Get transaction details
 *************************************** */
export const getTransactionDetails = async (id: string): Promise<Transaction> => {
  try {
    const res = await axios.get(endpoints.transactions.details(id));
    return res.data;
  } catch (error) {
    console.error("Error getting transaction details:", error);
    throw error;
  }
};

/** **************************************
 * Get wallet limits
 *************************************** */
export const getWalletLimits = async (params: {
  operation: string;
  walletId: string;
}): Promise<WalletLimits> => {
  try {
    const res = await axios.post(endpoints.wallets.limits, params);
    return res.data;
  } catch (error) {
    console.error("Error getting wallet limits:", error);
    throw error;
  }
};

/** **************************************
 * Get Currency Price
 *************************************** */
export const getCurrencyPrice = async (id: string): Promise<CurrencyPrice> => {
  try {
    const res = await axios.get(endpoints.wallets.price(id));
    return res.data;
  } catch (error) {
    console.error("Error getting currency price:", error);
    throw error;
  }
};

/** **************************************
 * Get wallets prices
 *************************************** */
export const getWalletsPrices = async (): Promise<LatestPrice[]> => {
  try {
    const res = await axios.get(endpoints.wallets.prices);
    return res.data;
  } catch (error) {
    console.error("Error getting wallets prices:", error);
    throw error;
  }
};
