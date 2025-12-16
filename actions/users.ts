import { PaginationRequest, PaginationResponse, UserAdminDto, UsersResponseVm } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** Get all users */
export const getUsers = async (
  params: PaginationRequest
): Promise<PaginationResponse<UsersResponseVm>> => {
  try {
    const res = await axios.get(endpoints.users.list, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting clients list:", error);
    throw error;
  }
};

/** Get countries list */
export const fetchCountries = async () => {
  try {
    const res = await axios.get(endpoints.users.countries);
    return res.data;
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

/** Get user by id */
export const getUserById = async (id: string) => {
  try {
    const res = await axios.get(endpoints.users.details(id));
    return res.data;
  } catch (error) {
    console.error("Error getting user by id:", error);
    throw error;
  }
};

/** Create user */
export const createUser = async (data: UserAdminDto) => {
  try {
    const res = await axios.post(endpoints.users.create, data);
    return res.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/** Update user */
export const updateUser = async (id: string, data: UserAdminDto) => {
  try {
    const res = await axios.put(endpoints.users.update(id), data);
    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/** Check if email exists */
export const sendEmailVerification = async (email: string) => {
  try {
    const res = await axios.post(endpoints.users.checkEmailAvailability, { email });
    return res.data;
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

/**Resend verification email */
export const resendEmailVerification = async (id: string) => {
  try {
    const res = await axios.post(endpoints.users.resendEmailVerification(id));
    return res.data;
  } catch (error) {
    console.error("Error resending email verification:", error);
    throw error;
  }
};

/**Deactivate admin user */
export const deactivateUser = async (id: string) => {
  try {
    const res = await axios.patch(endpoints.users.deactivate(id));
    return res.data;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

/**Activate admin user */
export const activateUser = async (id: string) => {
  try {
    const res = await axios.patch(endpoints.users.activate(id));
    return res.data;
  } catch (error) {
    console.error("Error activating user:", error);
    throw error;
  }
};
