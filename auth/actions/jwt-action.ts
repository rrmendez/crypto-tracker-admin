import { AuthResponse, SignInParams } from "@/types";
import axios, { endpoints } from "@/utils/axios";

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<AuthResponse> => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.login, params, {
      headers: {
        "X-Client-Type": "ADMIN",
      },
    });

    const { accessToken, refreshToken } = res.data;

    if (!accessToken) {
      throw new Error("Access token not found in response");
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};
