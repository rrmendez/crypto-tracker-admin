import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBoolean } from "@/hooks/use-boolean";
import { useQueryClient } from "@tanstack/react-query";
import { useSecurity } from "@/hooks/use-security";
import { toast } from "sonner";
import { CONFIG } from "@/config/global";
import { Loader2 } from "lucide-react";
import { useTranslate } from "@/locales";

type SwitchBlockTransferProps = {
  type: "block" | "unblock";
  userId?: string;
};

export default function SwitchBlockTransfer({ type = "block", userId }: SwitchBlockTransferProps) {
  const [open, setOpen] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [error, setError] = useState("");
  const loading = useBoolean();

  const { t } = useTranslate(["clients"]);
  const queryClient = useQueryClient();
  const { lockTransfersClients, unlockTransfersClients } = useSecurity();

  const handleCancel = () => {
    setOtherReasonText("");
    setError("");
    setOpen(false);
  };

  const handleTransfer = async () => {
    if (!otherReasonText.trim()) {
      setError(t("switchBlockTransfer.reasonError", { ns: "clients" }));
      return;
    }

    loading.onTrue();
    const mutation = type === "block" ? lockTransfersClients : unlockTransfersClients;

    await mutation.mutateAsync(
      { id: userId as string, reason: otherReasonText.trim() },
      {
        onSuccess: () => {
          toast.success(
            t(
              type === "block"
                ? "switchBlockTransfer.blockSuccess"
                : "switchBlockTransfer.unblockSuccess",
              { ns: "clients" }
            )
          );
          queryClient.invalidateQueries({
            queryKey: ["clients-details", userId],
          });
          queryClient.invalidateQueries({
            queryKey: [CONFIG.queryIds.securityLogs, userId, { page: 1, limit: 10 }],
          });
        },
      }
    );

    setOtherReasonText("");
    setError("");
    setOpen(false);
    loading.onFalse();
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
          {t(`switchBlockTransfer.${type === "block" ? "blockButton" : "unblockButton"}`, {
            ns: "clients",
          })}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md!"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {t(`switchBlockTransfer.${type === "block" ? "blockTitle" : "unblockTitle"}`, {
              ns: "clients",
            })}
          </DialogTitle>
        </DialogHeader>

        <h2 className="text-base">
          {t(
            `switchBlockTransfer.${type === "block" ? "blockConfirmation" : "unblockConfirmation"}`,
            { ns: "clients" }
          )}
        </h2>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">
              {t("switchBlockTransfer.reasonLabel", { ns: "clients" })}
            </Label>
            <p className="text-sm font-medium text-muted-foreground">
              {t("switchBlockTransfer.reasonHelper", { ns: "clients" })}
            </p>
          </div>

          <div className="grid gap-4">
            <Label htmlFor="other-reason">
              {t("switchBlockTransfer.reasonLabel", { ns: "clients" })}
            </Label>
            <Textarea
              id="other-reason"
              placeholder={t("switchBlockTransfer.reasonPlaceholder", { ns: "clients" })}
              value={otherReasonText}
              maxLength={100}
              onChange={(e) => {
                setOtherReasonText(e.target.value);
                setError("");
              }}
            />
            <p className="text-sm text-muted-foreground text-right">
              {t("switchBlockTransfer.reasonCounter", {
                ns: "clients",
                count: otherReasonText.length,
              })}
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 -mt-6">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("switchBlockTransfer.cancel", { ns: "clients" })}
          </Button>
          <Button onClick={handleTransfer} disabled={loading.value}>
            <span className="flex items-center gap-2">
              {loading.value && <Loader2 className="animate-spin" />}
              {t("switchBlockTransfer.confirm", { ns: "clients" })}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
