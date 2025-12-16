import { User } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Get user profile
 *************************************** */
export const getUserProfile = async (): Promise<User> => {
  try {
    const res = await axios.get(endpoints.profile.root);
    return res.data;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/** **************************************
 * Update avatar
 *************************************** */
export const updateAvatarClient = async (avatar: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", avatar);

    const res = await axios.post(endpoints.profile.updateAvatar, formData);
    return res.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};

/** **************************************
 * Update phone send code
 *************************************** */
export const updatePhoneSendCode = async (phone: string): Promise<string> => {
  try {
    const res = await axios.post(endpoints.profile.updatePhone, { phone });
    console.log("Desde el action: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/** **************************************
 * Update phone verify code
 *************************************** */
export const updatePhoneVerifyCode = async (phone: string, code: string): Promise<void> => {
  try {
    const res = await axios.post(endpoints.profile.verifyCodePhone, { phone, code });
    console.log("Desde el action: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/** **************************************
 * Check current password
 *************************************** */
export const checkCurrentPasswordClient = async (password: string): Promise<boolean> => {
  try {
    const res = await axios.post(endpoints.profile.checkCurrentPassword, { password });
    return res.data;
  } catch (error) {
    console.error("Error checking current password:", error);
    throw error;
  }
};

/** **************************************
 * Update password
 *************************************** */
export const updatePasswordClient = async (
  password: string,
  newPassword: string
): Promise<void> => {
  try {
    const res = await axios.post(endpoints.profile.updatePassword, { password, newPassword });
    return res.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

/** **************************************
 * hd-wallet-mnemonic
 *************************************** */
export const getMnemonic = async (
  password: string,
  secondFactorCode: string
): Promise<{ mnemonic: string }> => {
  try {
    const res = await axios.post(endpoints.profile.hdWalletMnemonic, {
      password,
      secondFactorCode,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting mnemonic:", error);
    throw error;
  }
};
