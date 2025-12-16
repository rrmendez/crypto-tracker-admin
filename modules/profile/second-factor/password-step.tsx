import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoolean } from "@/hooks/use-boolean";
import useProfile from "@/hooks/use-profile";
import { useTranslate } from "@/locales";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

type PasswordStepProps = {
  onNext: () => void;
  password: string;
  setPassword: (password: string) => void;
  onBack: () => void;
};

export default function PasswordStep({ onNext, onBack, password, setPassword }: PasswordStepProps) {
  const { t } = useTranslate("profile");
  const [error, setError] = useState("");
  const { checkCurrentPassword } = useProfile();
  const checkCurrentPasswordMutation = checkCurrentPassword();
  const showPassword = useBoolean();

  const handleCheck = async () => {
    setError("");
    checkCurrentPasswordMutation.mutate(password, {
      onSuccess: () => {
        onNext();
      },
      onError: (error) => {
        console.error("Error checking current password:", error);
        setError(t("securityTab.checkingError", { ns: "profile" }));
      },
    });
  };

  const handleOnBack = () => {
    setPassword("");
    setError("");
    onBack();
  };

  return (
    <>
      <div className="grid gap-6 mb-14 ">
        <p className="text-center text-sm text-muted-foreground">
          {t("disableSecondFactorDialog.password", { ns: "profile" })}
        </p>
        <div className="flex flex-col justify-center relative ">
          <div className="w-full text-left">
            <Label htmlFor="password" className="block text-sm font-medium  mb-2">
              {t("codeStep.passwordLabel", { ns: "profile" }) || "Contraseña de tu cuenta"}
            </Label>
            <div className="relative w-full flex flex-col gap-2 ">
              <Input
                id="password"
                type={showPassword.value ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                className="w-full"
                placeholder={
                  t("codeStep.passwordPlaceholder", { ns: "profile" }) || "Introduce tu contraseña"
                }
              />
              <Button
                type="button"
                onClick={showPassword.onToggle}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-0.5 h-8 w-8 rounded-full p-0"
              >
                {showPassword.value ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={handleOnBack}>
          {t("codeStep.back", { ns: "profile" })}
        </Button>
        <Button
          onClick={handleCheck}
          disabled={checkCurrentPasswordMutation.isPending || password === ""}
        >
          {checkCurrentPasswordMutation.isPending ? (
            <span className="flex items-center space-x-2">
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
