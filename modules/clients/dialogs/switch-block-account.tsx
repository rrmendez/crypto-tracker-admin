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
import { useSecurity } from "@/hooks/use-security";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useBoolean } from "@/hooks/use-boolean";
import { Loader2 } from "lucide-react";
import { CONFIG } from "@/config/global";
import { useTranslate } from "@/locales";

type SwitchBlockAccountProps = {
  type: "block" | "unblock";
  userId?: string;
};

export default function SwitchBlockAccount({ type = "block", userId }: SwitchBlockAccountProps) {
  const [open, setOpen] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [error, setError] = useState("");
  const loading = useBoolean();

  const { t } = useTranslate(["clients"]);
  const queryClient = useQueryClient();
  const { lockAccountClients, unlockAccountClients } = useSecurity();

  const handleCancel = () => {
    setOtherReasonText("");
    setError("");
    setOpen(false);
  };

  const handleAccount = async () => {
    if (!otherReasonText.trim()) {
      setError(t("switchBlockAccount.reasonError", { ns: "clients" }));
      return;
    }

    loading.onTrue();
    const mutation = type === "block" ? lockAccountClients : unlockAccountClients;

    await mutation.mutateAsync(
      { id: userId as string, reason: otherReasonText.trim() },
      {
        onSuccess: () => {
          toast.success(
            t(
              type === "block"
                ? "switchBlockAccount.blockSuccess"
                : "switchBlockAccount.unblockSuccess",
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
          {t(`switchBlockAccount.${type === "block" ? "blockButton" : "unblockButton"}`, {
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
            {t(`switchBlockAccount.${type === "block" ? "blockTitle" : "unblockTitle"}`, {
              ns: "clients",
            })}
          </DialogTitle>
        </DialogHeader>

        <h2 className="text-base">
          {t(
            `switchBlockAccount.${type === "block" ? "blockConfirmation" : "unblockConfirmation"}`,
            { ns: "clients" }
          )}
        </h2>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">{t("switchBlockAccount.reasonLabel", { ns: "clients" })}</Label>
            <p className="text-sm font-medium text-muted-foreground">
              {t("switchBlockAccount.reasonHelper", { ns: "clients" })}
            </p>
          </div>

          <div className="grid gap-4">
            <Label htmlFor="other-reason">
              {t("switchBlockAccount.reasonLabel", { ns: "clients" })}
            </Label>
            <Textarea
              id="other-reason"
              placeholder={t("switchBlockAccount.reasonPlaceholder", { ns: "clients" })}
              value={otherReasonText}
              maxLength={100}
              onChange={(e) => {
                setOtherReasonText(e.target.value);
                setError("");
              }}
            />
            <p className="text-sm text-muted-foreground text-right">
              {t("switchBlockAccount.reasonCounter", {
                ns: "clients",
                count: otherReasonText.length,
              })}
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 -mt-6">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("switchBlockAccount.cancel", { ns: "clients" })}
          </Button>
          <Button onClick={handleAccount} disabled={loading.value}>
            <span className="flex items-center gap-2">
              {loading.value && <Loader2 className="animate-spin" />}
              {t("switchBlockAccount.confirm", { ns: "clients" })}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
