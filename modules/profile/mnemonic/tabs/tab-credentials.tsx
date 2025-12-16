import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useBoolean } from "@/hooks/use-boolean";
import useProfile from "@/hooks/use-profile";
import { useTranslate } from "@/locales";
import { getMessageError } from "@/utils/helper";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

interface TabCredentialsProps {
  onNext: (privateKey: string) => void;
  onCancel: () => void;
}

export default function TabCredentials({ onNext, onCancel }: TabCredentialsProps) {
  const { t } = useTranslate("profile");
  const [error, setError] = useState("");
  const { getMnemonicAdmin } = useProfile();
  const getMnemonicAdminMutation = getMnemonicAdmin();
  const showPassword = useBoolean();
  const [codeInput, setCodeInput] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    getMnemonicAdminMutation.mutate(
      { password, secondFactorCode: codeInput },
      {
        onSuccess: (value) => {
          const { mnemonic } = value;
          onNext(mnemonic);
        },
        onError: (error) => {
          const message = getMessageError(error);
          setError(message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center  px-6">
      <div className="max-w-md w-full text-center space-y-2 mb-8">
        <p className="text-sm text-muted-foreground">
          {t("mnemonicDialog.subtitle", { ns: "profile" })}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="password" className="text-sm font-medium">
            {t("codeStep.passwordLabel", { ns: "profile" }) || "Contraseña de tu cuenta"}
          </Label>

          <Input
            id="password"
            type={showPassword.value ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setError("");
              setPassword(e.target.value);
            }}
            className="pr-10"
            placeholder={
              t("codeStep.passwordPlaceholder", { ns: "profile" }) || "Introduce tu contraseña"
            }
          />

          <Button
            type="button"
            onClick={showPassword.onToggle}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-[30px] h-8 w-8 rounded-full p-0"
          >
            {showPassword.value ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {error && <p className="text-xs text-red-500 text-center mt-1">{error}</p>}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Label htmlFor="otp" className="text-sm font-medium text-left w-full">
            {t("codeStep.codeLabel", { ns: "profile" }) || "Código de verificación (6 dígitos)"}
          </Label>

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
            <div className="flex justify-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-10 h-12 text-lg border border-border rounded-md text-center focus:ring-2 focus:ring-ring transition-all"
                />
              ))}
            </div>
          </InputOTP>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-3 w-full max-w-sm">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          {t("codeStep.back", { ns: "profile" }) || "Volver"}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={getMnemonicAdminMutation.isPending || !password || codeInput.length < 6}
          className="flex-1"
        >
          {getMnemonicAdminMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              {t("codeStep.loading", { ns: "profile" }) || "Verificando"}
              <Loader2 className="animate-spin h-4 w-4" />
            </span>
          ) : (
            t("codeStep.continue", { ns: "profile" }) || "Continuar"
          )}
        </Button>
      </div>
    </div>
  );
}
