import { PaginationRequest, PaginationResponse, UserSecurityLogVm } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Security Logs
 *************************************** */
export const getSecurityLogs = async (
  id: string,
  params: PaginationRequest
): Promise<PaginationResponse<UserSecurityLogVm>> => {
  try {
    const res = await axios.get(endpoints.security.logs(id), {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting clients list:", error);
    throw error;
  }
};

/** **************************************
 * Lock account
 *************************************** */
export const lockAccount = async (id: string, reason: string): Promise<void> => {
  try {
    await axios.post(endpoints.security.lockAccount(id), { reason });
  } catch (error) {
    console.error("Error locking account:", error);
    throw error;
  }
};

/** **************************************
 * Unlock account
 *************************************** */
export const unlockAccount = async (id: string, reason: string): Promise<void> => {
  try {
    await axios.post(endpoints.security.unlockAccount(id), { reason });
  } catch (error) {
    console.error("Error unlocking account:", error);
    throw error;
  }
};

/** **************************************
 * Lock transfers
 *************************************** */
export const lockTransfers = async (id: string, reason: string): Promise<void> => {
  try {
    await axios.post(endpoints.security.lockTransfers(id), { reason });
  } catch (error) {
    console.error("Error locking transfers:", error);
    throw error;
  }
};

/** **************************************
 * Unlock transfers
 *************************************** */
export const unlockTransfers = async (id: string, reason: string): Promise<void> => {
  try {
    await axios.post(endpoints.security.unlockTransfers(id), { reason });
  } catch (error) {
    console.error("Error unlocking transfers:", error);
    throw error;
  }
};

/** **************************************
 * Disable second factor
 *************************************** */
export const disableSecondFactor = async (userId: string): Promise<void> => {
  try {
    await axios.post(endpoints.security.disableSecondFactor, { userId });
  } catch (error) {
    console.error("Error disabling second factor:", error);
    throw error;
  }
};
