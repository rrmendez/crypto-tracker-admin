/* eslint-disable react-hooks/rules-of-hooks */

import {
  checkRecoverSecondFactorToken,
  confirmDisableSF,
  disable2FAClient,
  get2FASecretClient,
  signInWith2FAClient,
  verifyCode2FAClient,
} from "@/actions/2fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function use2FA() {
  const queryClient = useQueryClient();

  const get2FASecret = () =>
    useMutation({
      mutationFn: () => get2FASecretClient(),
      onSuccess: (data) => {
        queryClient.setQueryData(["2fa-secret"], data);
      },
    });

  const verifyCode2FA = () => {
    return useMutation({
      mutationFn: (code: string) => verifyCode2FAClient(code),
    });
  };

  const disable2FA = () => {
    return useMutation({
      mutationFn: ({
        password,
        secondFactorCode,
      }: {
        password: string;
        secondFactorCode: string;
      }) => disable2FAClient(password, secondFactorCode),
    });
  };

  const signInWith2FA = () => {
    return useMutation({
      mutationFn: (secondFactorCode: string) => signInWith2FAClient(secondFactorCode),
    });
  };

  const checkRecoverSecondFactor = useMutation({
    mutationFn: (token: string) => checkRecoverSecondFactorToken(token),
  });

  const confirmDisableSecondFactor = useMutation({
    mutationFn: ({ token, email, password }: { token: string; email: string; password: string }) =>
      confirmDisableSF(token, email, password),
  });

  return {
    get2FASecret,
    verifyCode2FA,
    disable2FA,
    signInWith2FA,
    checkRecoverSecondFactor,
    confirmDisableSecondFactor,
  };
}
