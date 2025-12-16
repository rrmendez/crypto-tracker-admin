import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Stepper } from "./stepper";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Success from "./success";
import { useTranslate } from "@/locales";
import DisableStep from "../second-factor/disable-step";
import PasswordStep from "../second-factor/password-step";

export default function DisableSecondFactorDialog() {
  const { t } = useTranslate("profile");
  const [currentStep, setCurrentStep] = useState("pwd");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const steps = [
    { id: "pwd", label: t("disableSecondFactorDialog.pwd", { ns: "profile" }) },
    { id: "code", label: t("disableSecondFactorDialog.code", { ns: "profile" }) },
    { id: "success", label: t("disableSecondFactorDialog.success", { ns: "profile" }) },
  ];

  const handleCancel = () => {
    setOpen(false);
    setCurrentStep("pwd");
  };

  const handleNext = () => {
    if (currentStep === "pwd") {
      setCurrentStep("code");
    } else if (currentStep === "code") {
      setCurrentStep("success");
    }
  };

  const handleBack = () => {
    setCurrentStep("pwd");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        } else {
          setOpen(true);
        }
      }}
      modal={true}
    >
      <DialogTrigger asChild>
        <Button className="w-fit shrink-0">
          {t("disableSecondFactorDialog.button", { ns: "profile" })}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md!"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("disableSecondFactorDialog.title", { ns: "profile" })}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col  h-full">
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === "pwd" && (
            <PasswordStep
              onNext={handleNext}
              password={password}
              setPassword={setPassword}
              onBack={handleCancel}
            />
          )}
          {currentStep === "code" && (
            <DisableStep onNext={handleNext} onBack={handleBack} password={password} />
          )}
          {currentStep === "success" && (
            <Success onClose={handleCancel} description="disableSecondFactorDialog.description" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
