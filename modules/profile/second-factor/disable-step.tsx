import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useTranslate } from "@/locales";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import use2FA from "@/hooks/use-2fa";
import { useQueryClient } from "@tanstack/react-query";
import { CONFIG } from "@/config/global";
import { Loader2 } from "lucide-react";

export default function DisableStep({
  onNext,
  password,
  onBack,
}: {
  onNext: () => void;
  password: string;
  onBack: () => void;
}) {
  const { t } = useTranslate("profile");
  const { disable2FA } = use2FA();
  const disable2FAMutation = disable2FA();
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const [codeInput, setCodeInput] = useState("");

  const handleSubmit = () => {
    disable2FAMutation.mutate(
      {
        password,
        secondFactorCode: codeInput,
      },
      {
        onSuccess: () => {
          setCodeInput("");
          queryClient.invalidateQueries({ queryKey: [CONFIG.queryIds.user] });
          onNext();
        },
        onError: (error) => {
          setError(t("codeStep.error", { ns: "profile" }));
          console.error("Error disabling 2FA:", error);
        },
      }
    );
  };

  return (
    <>
      <div className="grid gap-6 mb-14 ">
        <div className="flex flex-col justify-center relative ">
          <label htmlFor="otp" className="block text-sm font-medium  mb-2">
            {t("codeStep.codeLabel", { ns: "profile" }) || "Código de verificación (6 dígitos)"}
          </label>
          <InputOTP
            id="otp"
            maxLength={6}
            value={codeInput}
            onChange={(value) => {
              const numericValue = value.replace(/\D/g, "");
              setError("");
              setCodeInput(numericValue);
            }}
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
          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onBack}>
          {t("codeStep.back", { ns: "profile" })}
        </Button>
        <Button onClick={handleSubmit} disabled={codeInput.length < 6}>
          {disable2FAMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              {t("codeStep.loading", { ns: "profile" })}
            </span>
          ) : (
            t("codeStep.submit", { ns: "profile" })
          )}
        </Button>
      </div>
    </>
  );
}
