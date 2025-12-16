import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Stepper } from "./tabs/stepper";
import InputPhone from "./tabs/steps-phone/input-phone";
import CodeSms from "./tabs/steps-phone/code-sms";
import Success from "./tabs/success";
import useProfile from "@/hooks/use-profile";
import { useTranslate } from "@/locales";

const steps = [
  { id: "phone", label: "" },
  { id: "code", label: "" },
  { id: "success", label: "" },
];

export default function EditPhoneDialog({ currentPhone }: { currentPhone?: string }) {
  const { t } = useTranslate("profile");

  const [currentStep, setCurrentStep] = useState("phone");
  const [phone, setPhone] = useState(currentPhone || "");
  const [open, setOpen] = useState(false);

  const { getCodePhone } = useProfile();

  const sendCodeMutation = getCodePhone();

  const handleSubmit = (data?: string) => {
    switch (currentStep) {
      case "phone":
        if (data) {
          setPhone(data);
          if (data !== phone) {
            sendCodeMutation.mutate(data, {
              onSuccess: () => {
                setCurrentStep("code");
              },
              onError: (error) => {
                console.error("Error al enviar el código:", error);
              },
            });
          } else {
            setCurrentStep("code");
          }
        }
        break;
      case "code":
        setCurrentStep("success");
        break;

      default:
        break;
    }
  };

  const handleBack = () => {
    setCurrentStep("phone");
  };

  const handleCancel = () => {
    setOpen(false);
    setCurrentStep("phone");
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
        <Button variant="outline">
          {currentPhone ? (
            <span className="flex items-center">
              <PencilIcon className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">{t("editPhoneDialog.edit")}</span>
            </span>
          ) : (
            <span className="flex items-center">
              <PlusIcon className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">{t("editPhoneDialog.add")}</span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md!"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("editPhoneDialog.title")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-6 h-full">
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === "phone" && (
            <InputPhone
              currentPhone={phone}
              onNext={handleSubmit}
              onClose={handleCancel}
              loading={sendCodeMutation.isPending}
            />
          )}

          {currentStep === "code" && (
            <CodeSms onBack={handleBack} onConfirm={handleSubmit} phone={phone} />
          )}

          {currentStep === "success" && <Success onClose={handleCancel} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
