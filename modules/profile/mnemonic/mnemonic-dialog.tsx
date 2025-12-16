import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Stepper } from "../tabs/stepper";
import { useState } from "react";
import TabCredentials from "./tabs/tab-credentials";
import Success from "../tabs/success";
import { useTranslate } from "@/locales";

interface MnemonicDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (secret: string) => void;
}

export default function MnemonicDialog({ open, onClose, onSuccess }: MnemonicDialogProps) {
  const [secret, setSecret] = useState("");
  const [currentStep, setCurrentStep] = useState("credentials");
  const { t } = useTranslate("profile");

  const steps = [
    { id: "credentials", label: t("mnemonicDialog.steps.credentials", { ns: "profile" }) },
    { id: "success", label: t("mnemonicDialog.steps.success", { ns: "profile" }) },
  ];

  const handleNext = (mnemonic: string) => {
    setSecret(mnemonic);
    setCurrentStep("success");
  };

  const handleFinish = () => {
    onSuccess(secret);
    setCurrentStep("credentials");
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal={true}>
      <DialogContent
        className="max-w-md!"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("mnemonicDialog.title", { ns: "profile" })}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col  h-full">
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === "credentials" && (
            <TabCredentials onNext={handleNext} onCancel={onClose} />
          )}
          {currentStep === "success" && (
            <Success onClose={handleFinish} description="mnemonicDialog.description" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
