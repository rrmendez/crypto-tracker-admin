import { CopyButton } from "@/components/animate-ui/buttons/copy";
import { ToggleVisibilityButton } from "@/components/animate-ui/buttons/eye";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoolean } from "@/hooks/use-boolean";
import useProfile from "@/hooks/use-profile";
import MnemonicDialog from "../mnemonic/mnemonic-dialog";
import { useState } from "react";
import { useTranslate } from "@/locales";

export default function PrivateKeyCard() {
  const { t } = useTranslate("profile");

  const { getProfile } = useProfile();
  const { data: user } = getProfile();

  const masked = useBoolean(true);
  const maskChar = "•";
  const maskedValue = (val: string) => maskChar.repeat(Math.max(50, val.length));
  const [privateKey, setPrivateKey] = useState("");

  /** Dialogs */
  const openFactorNotEnabledModal = useBoolean();
  const open2FAModal = useBoolean();

  const handleVisibilityButton = () => {
    if (masked.value) {
      if (!user?.isSecondFactorEnabled) {
        openFactorNotEnabledModal.onTrue();
      } else {
        open2FAModal.onTrue();
      }
    } else {
      masked.onTrue();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("privateKeyCard.title", { ns: "profile" })}</CardTitle>
            <CardDescription>{t("privateKeyCard.description", { ns: "profile" })}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-muted-foreground">
              {t("privateKeyCard.label", { ns: "profile" })}
            </label>

            <div className="relative w-full">
              <div
                aria-hidden={false}
                className="w-full rounded border px-3 py-2  text-sm font-mono break-all flex items-center justify-between gap-8"
              >
                <span className="flex-1">
                  {masked.value ? maskedValue(privateKey) : privateKey}
                </span>

                <div className="flex items-center gap-2">
                  <CopyButton
                    variant="secondary"
                    size="md"
                    disabled={masked.value}
                    content={privateKey}
                  />
                  <ToggleVisibilityButton
                    isVisible={masked.value}
                    onClick={handleVisibilityButton}
                    variant="secondary"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("privateKeyCard.note", { ns: "profile" })}
            </p>
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={openFactorNotEnabledModal.value}
        onOpenChange={() => openFactorNotEnabledModal.onFalse()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("privateKeyCard.alert.title", { ns: "profile" })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("privateKeyCard.alert.description", { ns: "profile" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {t("privateKeyCard.alert.continue", { ns: "profile" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <MnemonicDialog
        open={open2FAModal.value}
        onClose={() => open2FAModal.onFalse()}
        onSuccess={(secret) => {
          setPrivateKey(secret);
          open2FAModal.onFalse();
          masked.onFalse();
        }}
      />
    </>
  );
}
