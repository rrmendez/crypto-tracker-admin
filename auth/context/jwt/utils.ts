import { paths } from "@/routes/paths";

import axios from "@/utils/axios";

import { STORAGE_KEY } from "./constant";

// ----------------------------------------------------------------------

const DEFAULT_TOKEN_DURATION = 60 * 60 * 24 * 365; // 1 year

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length < 2) {
      throw new Error("Invalid token!");
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded) {
      return false;
    }

    if ("exp" in decoded) {
      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    }

    return true;
  } catch (error) {
    console.error("Error during token validation:", error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert("Token expired!");
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = paths.auth.login;
    } catch (error) {
      console.error("Error during token expiration:", error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      localStorage.setItem(STORAGE_KEY, accessToken);

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server

      if (decodedToken && "iat" in decodedToken) {
        tokenExpired(decodedToken.iat + DEFAULT_TOKEN_DURATION); // add duration time after token creation
      } else {
        const now = Math.floor(Date.now() / 1000);
        tokenExpired(now + DEFAULT_TOKEN_DURATION); // add duration time after now
        // throw new Error("Invalid access token!");
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error("Error during set session:", error);
    throw error;
  }
}
