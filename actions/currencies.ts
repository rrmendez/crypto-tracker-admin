import {
  CreateCurrencyDto,
  Currency,
  CurrencyTemplate,
  PaginationRequest,
  PaginationResponse,
  Price,
  UpdateCurrencyDto,
} from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Get currencies list
 *************************************** */
export const getCurrenciesList = async (
  params: PaginationRequest
): Promise<PaginationResponse<Currency>> => {
  try {
    const res = await axios.get(endpoints.currencies.root, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting currencies list:", error);
    throw error;
  }
};

/** **************************************
 * Get currencies all
 *************************************** */
export const getCurrenciesAll = async (): Promise<Currency[]> => {
  try {
    const res = await axios.get(`${endpoints.currencies.root}/all`);
    return res.data;
  } catch (error) {
    console.error("Error getting currencies list:", error);
    throw error;
  }
};

/** **************************************
 * Get currency by id
 *************************************** */
export const getCurrencyById = async (id: string): Promise<Currency> => {
  try {
    const res = await axios.get(`${endpoints.currencies.root}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting currency by id:", error);
    throw error;
  }
};

/** **************************************
 * Get currency template
 *************************************** */
export const getCurrencyTemplate = async (): Promise<CurrencyTemplate[]> => {
  try {
    const res = await axios.get(endpoints.currencies.template);
    return res.data;
  } catch (error) {
    console.error("Error getting currency template:", error);
    throw error;
  }
};

/** **************************************
 * Create currency
 *************************************** */
export const createCurrency = async (data: CreateCurrencyDto): Promise<Currency> => {
  try {
    const res = await axios.post(endpoints.currencies.root, data);
    return res.data;
  } catch (error) {
    console.error("Error creating currency:", error);
    throw error;
  }
};

/** **************************************
 * Update currency
 *************************************** */
export const updateCurrency = async (id: string, data: UpdateCurrencyDto): Promise<Currency> => {
  try {
    const res = await axios.patch(`${endpoints.currencies.root}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating currency:", error);
    throw error;
  }
};

/** **************************************
 * Enable or disable currency
 *************************************** */
export const enableOrDisableCurrency = async (id: string, isActive: boolean): Promise<Currency> => {
  try {
    const res = await axios.post(`${endpoints.currencies.enableOrDisable(id)}`, { isActive });
    return res.data;
  } catch (error) {
    console.error("Error updating currency:", error);
    throw error;
  }
};

/** **************************************
 * Delete currency
 *************************************** */
export const deleteCurrency = async (id: string): Promise<Currency> => {
  try {
    const res = await axios.delete(`${endpoints.currencies.root}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting currency:", error);
    throw error;
  }
};

/** Get currencies price */
export const getCurrenciesPrice = async (
  id: string
): Promise<{ usdPrice: number; date: string; code: string }> => {
  try {
    const res = await axios.get(`${endpoints.currencies.price(id)}`);
    return res.data;
  } catch (error) {
    console.error("Error getting currencies price:", error);
    throw error;
  }
};

/************************************
 * Sync currency price
 ************************************/
export const syncCurrencyPrice = async (id: string): Promise<Price> => {
  try {
    const res = await axios.post(`${endpoints.currencies.sync(id)}`);
    return res.data;
  } catch (error) {
    console.error("Error syncing currency price:", error);
    throw error;
  }
};
