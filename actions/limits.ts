import { PaginationRequest, PaginationResponse } from "@/types";
import { CreateLimitDto, Limit, SystemOperation, UpdateLimitDto } from "@/types/limit";
import axios, { endpoints } from "@/utils/axios";

export const getLimitsList = async (
  params: PaginationRequest
): Promise<PaginationResponse<Limit>> => {
  try {
    const res = await axios.get(endpoints.limits.root, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting limits list:", error);
    throw error;
  }
};

export const getSystemOperationsList = async (): Promise<SystemOperation[]> => {
  try {
    const res = await axios.get(endpoints.limits.systemOperations);
    return res.data;
  } catch (error) {
    console.error("Error getting system operations list:", error);
    throw error;
  }
};

export const getLimitById = async (id: string): Promise<Limit> => {
  try {
    const res = await axios.get(`${endpoints.limits.root}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting limit by id:", error);
    throw error;
  }
};

export const createLimit = async (data: CreateLimitDto): Promise<Limit> => {
  try {
    const res = await axios.post(endpoints.limits.root, data);
    return res.data;
  } catch (error) {
    console.error("Error creating limit:", error);
    throw error;
  }
};

export const updateLimit = async (id: string, data: UpdateLimitDto): Promise<Limit> => {
  try {
    const res = await axios.patch(`${endpoints.limits.root}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating limit:", error);
    throw error;
  }
};

export const deleteLimit = async (id: string): Promise<Limit> => {
  try {
    const res = await axios.delete(`${endpoints.limits.root}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting limit:", error);
    throw error;
  }
};

export const getLimitsByClientId = async (clientId: string): Promise<PaginationResponse<Limit>> => {
  try {
    const res = await axios.get(`${endpoints.limits.limitsByUser(clientId)}`);
    return res.data;
  } catch (error) {
    console.error("Error getting limits by client id:", error);
    throw error;
  }
};
