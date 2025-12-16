import { PaginationRequest, PaginationResponse, UsersResponseVm } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Get clients list
 *************************************** */
export const getClientsList = async (
  params: PaginationRequest
): Promise<PaginationResponse<UsersResponseVm>> => {
  try {
    const res = await axios.get(endpoints.clients.list, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting clients list:", error);
    throw error;
  }
};

export const getClientDetails = async (id: string): Promise<UsersResponseVm> => {
  try {
    const res = await axios.get(endpoints.clients.details(id));
    return res.data;
  } catch (error) {
    console.error("Error getting client details:", error);
    throw error;
  }
};
