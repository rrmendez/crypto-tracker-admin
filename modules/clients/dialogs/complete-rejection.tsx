import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useKycs } from "@/hooks/use-kycs";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/locales";
import { getMessageError } from "@/utils/helper";

const rejectionReasons = [
  { value: "documento-ilegible", key: "illegible" },
  { value: "informacion-incompleta", key: "incomplete" },
  { value: "datos-no-coinciden", key: "mismatch" },
  { value: "foto-no-valida", key: "invalidPhoto" },
  { value: "otro", key: "other" },
];

type CompleteRejectionProps = {
  status: string;
};

export default function CompleteRejection({ status }: CompleteRejectionProps) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDetails, setRejectDetails] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { t } = useTranslate(["clients"]);

  const kycId = useParams().kycId;
  const { rejectKyc } = useKycs();

  const handleReject = () => {
    if (!rejectReason) {
      setError(t("completeRejection.selectReasonError", { ns: "clients" }));
      return;
    }

    if (rejectReason === "otro" && rejectDetails.trim() === "") {
      setError(t("completeRejection.otherReasonRequired", { ns: "clients" }));
      return;
    }

    const payload = rejectReason === "otro" ? rejectDetails : rejectReason;

    setError("");
    rejectKyc.mutateAsync(
      { id: kycId as string, rejectReason: payload },
      {
        onSuccess: () => {
          toast.success(t("completeRejection.success", { ns: "clients" }));
          queryClient.invalidateQueries({
            queryKey: ["kycs-details", kycId],
          });
          setIsRejectModalOpen(false);
          setRejectReason("");
          setRejectDetails("");
        },
        onError: (error) => {
          const message = getMessageError(error);
          toast.error(message);
          setIsRejectModalOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen} modal={true}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={status !== "PENDING"}>
          {t("completeRejection.rejectButton", { ns: "clients" })}
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("completeRejection.title", { ns: "clients" })}</DialogTitle>
          <DialogDescription>
            {t("completeRejection.description", { ns: "clients" })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">{t("completeRejection.reasonLabel", { ns: "clients" })}</Label>
            <Select
              onValueChange={(value) => {
                setRejectReason(value);
                setError("");
              }}
              value={rejectReason}
            >
              <SelectTrigger id="reason">
                <SelectValue
                  placeholder={t("completeRejection.selectPlaceholder", { ns: "clients" })}
                />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {t(`completeRejection.reasons.${reason.key}`, { ns: "clients" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {rejectReason === "otro" && (
            <div className="grid gap-2">
              <Label htmlFor="details">
                {t("completeRejection.detailsLabel", { ns: "clients" })}
              </Label>
              <Textarea
                id="details"
                placeholder={t("completeRejection.detailsPlaceholder", { ns: "clients" })}
                value={rejectDetails}
                onChange={(e) => {
                  setRejectDetails(e.target.value);
                  setError("");
                }}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
            {t("completeRejection.cancel", { ns: "clients" })}
          </Button>
          <Button onClick={handleReject} disabled={rejectKyc.isPending}>
            {rejectKyc.isPending && <Loader2 className="animate-spin" />}
            {t("completeRejection.confirm", { ns: "clients" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
