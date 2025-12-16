import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslate } from "@/locales";
import { Skeleton } from "@/components/ui/skeleton";

interface QRStepProps {
  otpAuthUrl?: string;
  secret?: string;
  message?: string;
  onNext: () => void;
  onClose: () => void;
}

export default function QRStep({ otpAuthUrl, secret, onNext, onClose, message }: QRStepProps) {
  const { t } = useTranslate("profile");

  const handleCopy = () => {
    navigator.clipboard.writeText(secret || "").then(() => {
      toast(t("activateSecondFactorDialog.toastCopy", { ns: "profile" }));
    });
  };

  return (
    <>
      <div className="grid gap-6 mb-14">
        <p className="text-center text-sm text-muted-foreground">{t(message || "")}</p>

        <div className="flex justify-center">
          {otpAuthUrl ? (
            <Image src={otpAuthUrl} alt="Código QR de autenticación" width={200} height={200} />
          ) : (
            <div className="mx-auto">
              <Skeleton className="w-40 h-40 rounded-md" />
            </div>
          )}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>{t("qrStep.description")}</p>
          {secret ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-mono bg-muted">
              {secret}
              <Button variant="ghost" size="icon" onClick={handleCopy} className="ml-2">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="mt-1 inline-flex items-center gap-2 p-3 text-sm font-mono ">
              <Skeleton className="w-48 h-6 rounded-md" />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full  p-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t("qrStep.cancel")}
        </Button>
        <Button onClick={onNext}>{t("qrStep.continue")}</Button>
      </div>
    </>
  );
}
