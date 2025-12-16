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
import { useKycs } from "@/hooks/use-kycs";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/locales";
import { getMessageError } from "@/utils/helper";

type ApprovalModalProps = {
  status: string;
};

export default function ApprovalModal({ status }: ApprovalModalProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslate(["clients"]);

  const kycId = useParams().kycId;
  const { approveKyc } = useKycs();

  const handleApprove = async () => {
    await approveKyc.mutateAsync(kycId as string, {
      onSuccess: () => {
        toast.success(t("approvalModal.success", { ns: "clients" }));
        queryClient.invalidateQueries({
          queryKey: ["kycs-details", kycId],
        });
        setIsApproveModalOpen(false);
      },
      onError: (error) => {
        const message = getMessageError(error);
        toast.error(message);
        setIsApproveModalOpen(false);
      },
    });
  };

  return (
    <Dialog modal={true} open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
      <DialogTrigger asChild>
        <Button disabled={status !== "PENDING"}>
          {t("approvalModal.button", { ns: "clients" })}
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("approvalModal.title", { ns: "clients" })}</DialogTitle>
          <DialogDescription>{t("approvalModal.description", { ns: "clients" })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
            {t("approvalModal.cancel", { ns: "clients" })}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveKyc.isPending}
            className="flex items-center gap-2"
          >
            {approveKyc.isPending && <Loader2 className="animate-spin" />}
            {t("approvalModal.confirm", { ns: "clients" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
