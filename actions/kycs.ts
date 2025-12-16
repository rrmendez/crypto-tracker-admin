import { KYCResponseVm, PaginationRequest, PaginationResponse } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** *******************************************
 * KYCS-by-user
 **********************************************/
export const getKycsByClient = async (
  params: PaginationRequest,
  clientId: string
): Promise<PaginationResponse<KYCResponseVm>> => {
  try {
    const res = await axios.get(endpoints.kycs.kycsByUser(clientId), {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting clients list:", error);
    throw error;
  }
};

/** *******************************************
 * KYCS-details
 **********************************************/
export const kycsDetails = async (id: string): Promise<KYCResponseVm> => {
  try {
    const res = await axios.get(endpoints.kycs.kycsDetails(id));
    return res.data;
  } catch (error) {
    console.error("Error getting client details:", error);
    throw error;
  }
};

/** *******************************************
 * Approve Kyc
 **********************************************/
export const approveKycClient = async (id: string): Promise<void> => {
  try {
    const res = await axios.patch(endpoints.kycs.approveKyc(id));
    return res.data;
  } catch (error) {
    console.error("Error approving kyc:", error);
    throw error;
  }
};

/** *******************************************
 * Reject Kyc
 **********************************************/
export const rejectKycClient = async (id: string, rejectReason: string): Promise<void> => {
  try {
    const res = await axios.patch(endpoints.kycs.rejectKyc(id), {
      rejectReason,
    });
    return res.data;
  } catch (error) {
    console.error("Error rejecting kyc:", error);
    throw error;
  }
};

/** *******************************************
 * Partially reject Kyc
 **********************************************/
export const partiallyRejectKycClient = async (
  id: string,
  documentIds: string[],
  rejectReason: string
): Promise<void> => {
  try {
    const res = await axios.patch(endpoints.kycs.partiallyRejectKyc(id), {
      documentIds,
      rejectReason,
    });
    return res.data;
  } catch (error) {
    console.error("Error partially rejecting kyc:", error);
    throw error;
  }
};

/** *******************************************
 * List of Kycs
 **********************************************/
export const getKycsList = async (
  params: PaginationRequest
): Promise<PaginationResponse<KYCResponseVm>> => {
  try {
    const res = await axios.get(endpoints.kycs.kycsList, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting kycs list:", error);
    throw error;
  }
};
