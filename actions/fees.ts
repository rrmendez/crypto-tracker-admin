import { PaginationRequest, PaginationResponse } from "@/types";
import { Fee, UpdateFeeDto } from "@/types/fees";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Get fee list
 *************************************** */
export const getFeesList = async (params: PaginationRequest): Promise<PaginationResponse<Fee>> => {
  try {
    const res = await axios.get(endpoints.fees.root, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting fees list:", error);
    throw error;
  }
};

/** **************************************
 * Get fee by id
 *************************************** */
export const getFeeById = async (id: string): Promise<Fee> => {
  try {
    const res = await axios.get(`${endpoints.fees.root}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting fee by id:", error);
    throw error;
  }
};

/** **************************************
 * Create fee
 *************************************** */
export const createFee = async (data: UpdateFeeDto): Promise<Fee> => {
  try {
    const res = await axios.post(endpoints.fees.root, data);
    return res.data;
  } catch (error) {
    console.error("Error creating fee:", error);
    throw error;
  }
};

/** **************************************
 * Update fee
 *************************************** */
export const updateFee = async (id: string, data: UpdateFeeDto): Promise<Fee> => {
  try {
    const res = await axios.patch(`${endpoints.fees.root}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating fee:", error);
    throw error;
  }
};

/** **************************************
 * Delete fee
 *************************************** */
export const deleteFee = async (id: string): Promise<Fee> => {
  try {
    const res = await axios.delete(`${endpoints.fees.root}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting fee:", error);
    throw error;
  }
};
