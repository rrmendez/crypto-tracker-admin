import { Price, TotalBalance, TotalTransactions, Wallet } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/**Get wallets for dashboard */
export async function getWalletsByDashboard(): Promise<Wallet[]> {
  try {
    const res = await axios.get(endpoints.dashboard.wallets);
    return res.data;
  } catch (error) {
    console.error("Error getting wallets list:", error);
    throw error;
  }
}

/** **************************************
 * Get clients totals
 *************************************** */
export async function getClientsTotals(): Promise<{ role: string; quantity: number }[]> {
  try {
    const res = await axios.get(endpoints.dashboard.clients);
    return res.data;
  } catch (error) {
    console.error("Error getting clients totals:", error);
    throw error;
  }
}

/** **************************************
 * Get balances by dashboard
 *************************************** */
export async function getWalletsBalancesByDashboard(): Promise<TotalBalance[]> {
  try {
    const res = await axios.get(endpoints.dashboard.balances);
    return res.data;
  } catch (error) {
    console.error("Error getting balances by dashboard:", error);
    throw error;
  }
}

/** **************************************
 * Get currencies prices
 *************************************** */
export async function getCurrenciesPrices(): Promise<Price[]> {
  try {
    const res = await axios.get(endpoints.dashboard.prices);
    return res.data;
  } catch (error) {
    console.error("Error getting currencies prices:", error);
    throw error;
  }
}

/** **************************************
 * Get transactions by dashboard
 *************************************** */
export async function getTransactionsByDashboard(): Promise<TotalTransactions[]> {
  try {
    const res = await axios.get(endpoints.dashboard.transactions);
    return res.data;
  } catch (error) {
    console.error("Error getting transactions by dashboard:", error);
    throw error;
  }
}
