"use client";

import axios, { endpoints } from "@/utils/axios";
import md5 from "md5";
import { setSession } from "./utils";

// ----------------------------------------------------------------------

export type SignInParams = {
  identifier: string;
  password: string;
};

export type SignInAsAnonymousParams = {
  accept: boolean;
  email: string;
  fpHash: string;
  recaptcha: string;
  language: string;
};

export type RegisterParams = {
  accept: boolean;
  email: string;
  password: string;
  recaptcha: string;
  language: string;
};

export type ForgotPasswordParams = {
  email: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  identifier,
  password,
}: SignInParams): Promise<{ status: string; accessToken?: string }> => {
  try {
    const params = { identifier, password: md5(password) };

    const res = await axios.post(endpoints.auth.login, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error("Access token not found in response");
    }

    setSession(accessToken);

    return { status: "success" };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

/** **************************************
 * Register
 *************************************** */
export const registerUser = async ({
  accept,
  email,
  password,
  recaptcha,
  language,
}: RegisterParams): Promise<{ status: string; accessToken?: string }> => {
  try {
    const params = { email, password: md5(password), accept, recaptcha, language };

    await axios.post(endpoints.auth.register, params);

    // const { accessToken } = res.data;

    // if (!accessToken) {
    //   throw new Error("Access token not found in response");
    // }

    // setSession(accessToken);

    return { status: "success" };
  } catch (error) {
    console.error("Error during register:", error);
    throw error;
  }
};

/** **************************************
 * Resend email for verification
 *************************************** */
export const resendEmail = async ({ email }: ForgotPasswordParams): Promise<{ status: string }> => {
  try {
    const params = { email };

    await axios.post(endpoints.auth.refreshToken, params);

    return { status: "success" };
  } catch (error) {
    console.error("Error during resend email:", error);
    throw error;
  }
};

/** **************************************
 * Forgot password
 *************************************** */
export const forgotPassword = async ({
  email,
}: ForgotPasswordParams): Promise<{ status: string }> => {
  try {
    const params = { email };

    await axios.post(endpoints.auth.forgotPassword, params, {
      headers: {
        "x-app-environment": "ADMIN",
      },
    });

    return { status: "success" };
  } catch (error) {
    console.error("Error during forgot password:", error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};

/** **************************************
 * Forgot token info
 *************************************** */

export const getTokenInfo = async (token: string): Promise<{ email: string }> => {
  try {
    const res = await axios.post(endpoints.auth.tokenInfo, { token });

    return res.data;
  } catch (error) {
    console.error("Error during get token info:", error);
    throw error;
  }
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}): Promise<{ refreshToken: string; accessToken: string }> => {
  try {
    const res = await axios.post(
      endpoints.auth.resetPassword,
      {
        email,
        password,
        token,
      },
      {
        headers: {
          "x-app-environment": "ADMIN",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error during reset password:", error);
    throw error;
  }
};

/** **************************************
 * Refresh Token
 *************************************** */
export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  try {
    const res = await axios.post(endpoints.auth.refreshToken, { refreshToken });

    return res.data;
  } catch (error) {
    console.error("Error during refresh token:", error);
    throw error;
  }
};

/** ************************************
 * Activate account
 ************************************* */
export const activateAccount = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}): Promise<{ refreshToken: string; accessToken: string }> => {
  try {
    const res = await axios.post(
      endpoints.auth.activateAccount,
      {
        email,
        password,
        token,
      },
      {
        headers: {
          "x-app-environment": "ADMIN",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error during activate account:", error);
    throw error;
  }
};
