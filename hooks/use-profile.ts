/* eslint-disable react-hooks/rules-of-hooks */
import {
  checkCurrentPasswordClient,
  getMnemonic,
  getUserProfile,
  updateAvatarClient,
  updatePasswordClient,
  updatePhoneSendCode,
  updatePhoneVerifyCode,
} from "@/actions/profile";
import { CONFIG } from "@/config/global";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";

// ----------------------------------------------------------------------

export default function useProfile() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const getProfile = () =>
    useQuery({
      queryKey: [CONFIG.queryIds.user],
      queryFn: getUserProfile,
      staleTime: CONFIG.cacheDuration,
      retry: 3,
      enabled: isLoggedIn,
    });

  const updateAvatar = () => {
    return useMutation({
      mutationFn: (avatar: File) => updateAvatarClient(avatar),
    });
  };

  const getCodePhone = () => {
    return useMutation({
      mutationFn: (phone: string) => updatePhoneSendCode(phone),
    });
  };

  const verifyCode = () => {
    return useMutation({
      mutationFn: ({ phone, code }: { phone: string; code: string }) =>
        updatePhoneVerifyCode(phone, code),
    });
  };

  const checkCurrentPassword = () => {
    return useMutation({
      mutationFn: (password: string) => checkCurrentPasswordClient(password),
    });
  };

  const updatePassword = () => {
    return useMutation({
      mutationFn: ({ password, newPassword }: { password: string; newPassword: string }) =>
        updatePasswordClient(password, newPassword),
    });
  };

  /** mnemonic */
  const getMnemonicAdmin = () => {
    return useMutation({
      mutationFn: ({
        password,
        secondFactorCode,
      }: {
        password: string;
        secondFactorCode: string;
      }) => getMnemonic(password, secondFactorCode),
    });
  };

  return {
    getProfile,
    updateAvatar,
    getCodePhone,
    verifyCode,
    checkCurrentPassword,
    updatePassword,
    getMnemonicAdmin,
  };
}
