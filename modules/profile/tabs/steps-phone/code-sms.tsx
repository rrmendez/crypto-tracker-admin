import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { CONFIG } from "@/config/global";
import useProfile from "@/hooks/use-profile";
import { useTranslate } from "@/locales";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type CodeSmsProps = {
  onBack: () => void;
  onConfirm: () => void;
  phone: string;
};

export default function CodeSms({ onBack, onConfirm, phone }: CodeSmsProps) {
  const [loading, setLoading] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const { t } = useTranslate(["register", "profile"]);
  const [error, setError] = useState("");
  const { getCodePhone, verifyCode } = useProfile();
  const sendCodeMutation = getCodePhone();
  const verifyCodeMutation = verifyCode();
  const queryClient = useQueryClient();

  const handleConfirmEmailCode = async (code: string) => {
    setLoading(true);
    setError("");

    verifyCodeMutation.mutate(
      { phone, code },
      {
        onSuccess: () => {
          setLoading(false);
          queryClient.invalidateQueries({ queryKey: [CONFIG.queryIds.user] });
          setEmailCodeInput("");
          onConfirm();
        },
        onError: (error) => {
          console.error("Error al verificar el código:", error);
          setError("Codigo incorrecto");
          setLoading(false);
        },
      }
    );
  };

  const handleResendCode = () => {
    if (timeLeft <= 0) {
      sendCodeMutation.mutateAsync(phone, {
        onSuccess: () => {
          setTimeLeft(60);
        },
        onError: () => {
          setTimeLeft(60);
        },
      });
    }
  };

  const handleSetEmailCodeInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setEmailCodeInput(numericValue);
    setError("");
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <>
      <div className="grid mb-14 h-20 justify-center">
        <div className="flex flex-col justify-center relative ">
          <InputOTP
            maxLength={6}
            value={emailCodeInput}
            onChange={handleSetEmailCodeInput}
            onComplete={(value) => handleConfirmEmailCode(value)}
          >
            <div className="flex space-x-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-blue-500 transition-all"
                />
              ))}
            </div>
          </InputOTP>
          {error && (
            <p className="text-[12px] text-red-500 absolute right-0 mt-2 top-full">
              {t("codeStep.error", { ns: "profile" })}
            </p>
          )}
        </div>
        <div className="text-xs mt-1">
          {timeLeft > 0 ? (
            <div className="flex justify-start items-center gap-2 py-1">
              <span>{t("stepTwo.email_confirmation.wait_time", { time: timeLeft })}</span>
            </div>
          ) : (
            <div className="flex justify-start py-1">
              <span
                onClick={handleResendCode}
                className="text-sm cursor-pointer underline transition-opacity"
              >
                {t("stepTwo.email_confirmation.resend_code")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onBack}>
          {t("codeStep.back", { ns: "profile" })}
        </Button>
        <Button
          onClick={() => handleConfirmEmailCode(emailCodeInput)}
          disabled={loading || !!error || emailCodeInput.length !== 6}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              {t("codeStep.loading", { ns: "profile" })}
            </span>
          ) : (
            t("codeStep.continue", { ns: "profile" })
          )}
        </Button>
      </div>
    </>
  );
}
