import { PaginationRequest, PaginationResponse } from "@/types";
import { Fee } from "@/types/fees";
import {
  AsyncFnResponse,
  NativeGasFee,
  RequestWithdrawDto,
  Transaction,
} from "@/types/transactions";
import axios, { endpoints } from "@/utils/axios";
import qs from "qs";

/** **************************************
 * Get transactions list
 *************************************** */
export const getTransactionsList = async (
  params: PaginationRequest & { walletId: string; type?: string }
): Promise<PaginationResponse<Transaction>> => {
  try {
    const res = await axios.get(`${endpoints.transactions.list}/${params.walletId}`, {
      params: {
        page: params.page,
        limit: params.limit,
        types: params.type?.split(","),
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting transactions list:", error);
    throw error;
  }
};

/** **************************************
 * Create transfer
 * ************************************* */
export const createTransfer = async (params: RequestWithdrawDto): Promise<AsyncFnResponse> => {
  try {
    const res = await axios.post(endpoints.transactions.transfer, params);
    return res.data;
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw error;
  }
};

/** **************************************
 * Get fee by currency and operation
 * ************************************* */
export const getFeeByCurrencyAndOperation = async (params: {
  currency: string;
  operation: string;
}): Promise<Fee[]> => {
  try {
    const res = await axios.post(endpoints.transactions.fees, {
      currencyId: params.currency,
      operation: params.operation,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting fee by currency and operation:", error);
    throw error;
  }
};

/** **************************************
 * Get fee by currency and operation
 * ************************************* */
export const getNativeFeeByCurrencyAndOperation = async (params: {
  currencyId: string;
  amount: number;
}): Promise<NativeGasFee> => {
  try {
    const res = await axios.post(endpoints.transactions.nativeGas, params);
    return res.data;
  } catch (error) {
    console.error("Error getting native fee by currency and operation:", error);
    throw error;
  }
};
