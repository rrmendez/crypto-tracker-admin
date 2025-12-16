/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import i18n from "i18next";

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers["Accept-Language"] = i18n.language || "en";

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, logOut, logIn } = useAuthStore.getState();

    const ignoredUrl = !(
      originalRequest?.url?.includes("auth/signin") ||
      originalRequest?.url?.includes("logout") ||
      originalRequest?.url?.includes("/assets/")
    );

    if (error.response?.status === 401 && ignoredUrl && !originalRequest._retry) {
      if (!refreshToken) {
        logOut();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${CONFIG.site.serverUrl}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        document.cookie = `auth-token=${response.data.accessToken}; path=/; secure; sameSite=lax`;
        logIn(newAccessToken, response.data.refreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logOut();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      (error.response && error.response.data) ||
        "Estamos presentando inconsistencia, intente más tarde!"
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: "/auth/signin",
    refreshToken: "/auth/refresh",
    register: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    tokenInfo: "/auth/forgot-token-info",
    resetPassword: "/auth/change-password",
    checkFactorToken: "/auth/check-recover-second-factor-token",
    confirmDisableSecondFactor: "/auth/confirm-disable-second-factor",
    sendEmailVerification: "/auth/send-email-verification",
    activateAccount: "/auth/activate-account",
  },
  profile: {
    root: "/auth/profile",
    updateAvatar: `/client/avatar`,
    updatePhone: "/client/send-phone-code",
    verifyCodePhone: "/client/verify-phone-code",
    checkCurrentPassword: "/auth/check-password",
    updatePassword: "/auth/password",
    hdWalletMnemonic: "/admin/users/hd-wallet-mnemonic",
  },
  clients: {
    list: "/admin/clients",
    details: (id: string) => `/admin/clients/${id}`,
  },
  transactions: {
    list: "/admin/wallets/:walletId/transactions",
    details: (id: string) => `/admin/transactions/${id}`,
    history: "/admin/transactions",
    transfer: "/admin/transactions/financial-withdraw",
    fees: "/admin/fees/query",
    nativeGas: "/admin/transactions/native-withdraw-fees",
  },
  wallets: {
    list: "/admin/wallets",
    details: (id: string) => `/admin/wallets/${id}`,
    create: (id: string) => `/admin/wallets/create-for-user/${id}`,
    walletsByUser: (clientId: string) => `/admin/wallets-by-user/${clientId}`,
    limits: "/client/limits-by-wallet",
    price: (currencyId: string) => `/currencies/${currencyId}/price`,
    prices: "/currencies/prices",
  },
  currencies: {
    root: "/admin/currencies",
    template: "/admin/currencies/template",
    enableOrDisable: (id: string) => `/admin/currencies/enable-disable/${id}`,
    price: (id: string) => `/currencies/${id}/price`,
    sync: (id: string) => `/admin/currencies/${id}/price`,
  },
  kycs: {
    root: "/admin/kycs",
    kycsByUser: (clientId: string) => `/admin/kycs-by-user/${clientId}`,
    kycsDetails: (id: string) => `/admin/kycs/${id}`,
    approveKyc: (id: string) => `/admin/kycs/${id}/approve`,
    rejectKyc: (id: string) => `/admin/kycs/${id}/reject`,
    kycsList: "/admin/kycs-list",
    partiallyRejectKyc: (id: string) => `/admin/kycs/${id}/partial-reject`,
  },
  security: {
    logs: (id: string) => `/admin/users/${id}/security-logs`,
    lockAccount: (id: string) => `/admin/users/${id}/lock-account`,
    unlockAccount: (id: string) => `/admin/users/${id}/unlock-account`,
    lockTransfers: (id: string) => `/admin/users/${id}/lock-transfers`,
    unlockTransfers: (id: string) => `/admin/users/${id}/unlock-transfers`,
    disableSecondFactor: "/admin/disable-second-factor",
  },
  limits: {
    root: "/admin/limits",
    systemOperations: "/admin/system-operations",
    limitsByUser: (clientId: string) => `/admin/limits-by-client/${clientId}`,
  },
  users: {
    list: "/admin/users",
    countries: "/auth/countries",
    details: (id: string) => `/admin/users/${id}`,
    update: (id: string) => `/admin/users/${id}`,
    create: "/admin/users",
    resendEmailVerification: (id: string) => `/admin/users/${id}/resend-verification-email`,
    checkEmailAvailability: "/admin/check-email-availability",
    deactivate: (id: string) => `/admin/users/${id}/deactivate`,
    activate: (id: string) => `/admin/users/${id}/activate`,
  },
  fSecret: {
    get2FASecret: "/auth/get-two-factor-secret",
    verifyCode2FA: "/auth/enable-second-factor",
    disable2FA: "/auth/disable-second-factor",
    signInWith2FA: "/auth/authenticate-with-two-factor",
  },
  fees: {
    root: "/admin/fees",
  },
  dashboard: {
    wallets: "/admin/dashboard/wallets",
    clients: "/admin/dashboard/clients",
    balances: "/admin/dashboard/balances",
    prices: "/currencies/prices",
    transactions: "/admin/dashboard/transactions",
  },
};
