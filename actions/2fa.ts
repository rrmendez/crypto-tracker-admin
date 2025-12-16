import axios, { endpoints } from "@/utils/axios";

/*** ***********************************************
 * Get 2FA secret
 * *********************************************** */
export const get2FASecretClient = async (): Promise<{
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}> => {
  try {
    const res = await axios.post(endpoints.fSecret.get2FASecret);
    return res.data;
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/** **************************************
 * Verify code 2FA & Enable 2FA
 * ************************************* */
export const verifyCode2FAClient = async (code: string): Promise<void> => {
  try {
    const res = await axios.post(endpoints.fSecret.verifyCode2FA, { secondFactorCode: code });
    return res.data;
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/** **************************************
 * Disable 2FA
 * ************************************* */
export const disable2FAClient = async (
  password: string,
  secondFactorCode: string
): Promise<void> => {
  try {
    const res = await axios.post(endpoints.fSecret.disable2FA, {
      password,
      secondFactorCode,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/** **************************************
 * Sign In with 2FA
 * ************************************* */
export const signInWith2FAClient = async (
  secondFactorCode: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const res = await axios.post(endpoints.fSecret.signInWith2FA, {
      secondFactorCode,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/** **************************************
 * Check Recover Second Factor Token
 *************************************** */
export const checkRecoverSecondFactorToken = async (token: string): Promise<{ email: string }> => {
  try {
    const res = await axios.post(endpoints.auth.checkFactorToken, { token });
    return res.data;
  } catch (error) {
    console.error("Error checking recover second factor token:", error);
    throw error;
  }
};

/** **************************************
 * Confirm Disable Second Factor
 *************************************** */
export const confirmDisableSF = async (
  token: string,
  email: string,
  password: string
): Promise<void> => {
  try {
    await axios.post(endpoints.auth.confirmDisableSecondFactor, { token, email, password });
  } catch (error) {
    console.error("Error confirming disable second factor:", error);
    throw error;
  }
};