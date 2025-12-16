import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { CONFIG } from "@/config/global";
import use2FA from "@/hooks/use-2fa";
import { useTranslate } from "@/locales";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type CodeSmsProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export default function CodeStep({ onBack, onConfirm }: CodeSmsProps) {
  const [loading, setLoading] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState("");
  const { t } = useTranslate(["register", "profile"]);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const { verifyCode2FA } = use2FA();
  const verifyCode2FAMutation = verifyCode2FA();

  const handleResendCode = async (code: string) => {
    setLoading(true);
    verifyCode2FAMutation.mutate(code, {
      onSuccess: () => {
        setLoading(false);
        queryClient.invalidateQueries({ queryKey: [CONFIG.queryIds.user] });
        onConfirm();
      },
      onError: (error) => {
        console.error("Error verifying code:", error);
        setError(t("codeStep.error", { ns: "profile" }));
        setLoading(false);
      },
    });
  };

  return (
    <>
      <div className="grid gap-6 mb-14 ">
        <p className="text-center text-sm text-muted-foreground">
          {t("codeStep.description", { ns: "profile" })}
        </p>
        <div className="flex flex-col justify-center items-center relative ">
          <InputOTP
            maxLength={6}
            value={emailCodeInput}
            onChange={(value) => {
              const numericValue = value.replace(/\D/g, "");
              setError("");
              setEmailCodeInput(numericValue);
            }}
            onComplete={(value) => handleResendCode(value)}
          >
            <div className="flex  space-x-3">
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
            <p className="text-[12px] text-red-500 absolute left-1/2 -translate-x-1/2 mt-2 top-full">
              {t("codeStep.error", { ns: "profile" })}
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onBack}>
          {t("codeStep.back", { ns: "profile" })}
        </Button>
        <Button onClick={() => handleResendCode(emailCodeInput)} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              {t("codeStep.loading", { ns: "profile" })} <Loader2 className="animate-spin" />
            </span>
          ) : (
            t("codeStep.continue", { ns: "profile" })
          )}
        </Button>
      </div>
    </>
  );
}
