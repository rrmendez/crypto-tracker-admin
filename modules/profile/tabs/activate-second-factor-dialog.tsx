import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Stepper } from "./stepper";
import QRStep from "../second-factor/qr-step";
import CodeStep from "../second-factor/code-step";
import Success from "./success";
import use2FA from "@/hooks/use-2fa";
import { useTranslate } from "@/locales";
import { useQueryClient } from "@tanstack/react-query";

export default function ActivateSecondFactorDialog() {
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState("qr");
  const [open, setOpen] = useState(false);
  const { t } = useTranslate("profile");

  const steps = [
    { id: "qr", label: t("activateSecondFactorDialog.QR", { ns: "profile" }) },
    { id: "code", label: t("activateSecondFactorDialog.code", { ns: "profile" }) },
    { id: "success", label: t("activateSecondFactorDialog.success", { ns: "profile" }) },
  ];

  const { get2FASecret } = use2FA();
  const get2FASecretMutation = get2FASecret();

  const { data: fSecret } = get2FASecretMutation;

  const handleOpen = () => {
    const cached = queryClient.getQueryData(["2fa-secret"]);
    if (!cached) {
      get2FASecretMutation.mutate();
    }
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setCurrentStep("qr");
  };

  const handleNext = () => {
    if (currentStep === "qr") {
      setCurrentStep("code");
    } else if (currentStep === "code") {
      setCurrentStep("success");
    }
  };

  const handleBack = () => {
    setCurrentStep("qr");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        } else {
          handleOpen();
        }
      }}
      modal={true}
    >
      <DialogTrigger asChild>
        <Button className="w-fit shrink-0">
          {t("activateSecondFactorDialog.button", { ns: "profile" })}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md!"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("activateSecondFactorDialog.title", { ns: "profile" })}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-6 h-full">
          <Stepper steps={steps} currentStep={currentStep} />
          {currentStep === "qr" && (
            <QRStep
              otpAuthUrl={fSecret?.qrCodeDataUrl}
              secret={fSecret?.secret}
              onNext={handleNext}
              onClose={handleCancel}
              message={t("activateSecondFactorDialog.message", { ns: "profile" })}
            />
          )}
          {currentStep === "code" && <CodeStep onBack={handleBack} onConfirm={handleNext} />}
          {currentStep === "success" && (
            <Success
              onClose={handleCancel}
              description={t("activateSecondFactorDialog.description", { ns: "profile" })}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
