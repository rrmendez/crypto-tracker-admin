import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useSecurity } from "@/hooks/use-security";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslate } from "@/locales/use-locales";
import { UsersResponseVm } from "@/types";

type SecondFactorProps = {
  user?: UsersResponseVm;
};

export default function SecondFactor({ user }: SecondFactorProps) {
  const { t } = useTranslate("common");
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { disableSecondFactorClients } = useSecurity();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDisable = async () => {
    await disableSecondFactorClients.mutateAsync(user?.id as string, {
      onSuccess: () => {
        toast.success(t("secondFactor.success", { ns: "common" }));
        queryClient.invalidateQueries({
          queryKey: ["clients-details", user?.id],
        });
      },
    });
    handleCancel();
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
        <Button className="w-fit shrink-0" disabled={!user?.isSecondFactorEnabled}>
          {t("secondFactor.button", { ns: "common" })}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md!"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("secondFactor.title", { ns: "common" })}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <p>{t("secondFactor.content", { ns: "common" })}</p>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            {t("secondFactor.cancel", { ns: "common" })}
          </Button>
          <Button onClick={handleDisable} disabled={disableSecondFactorClients.isPending}>
            {disableSecondFactorClients.isPending && <Loader2 className="animate-spin" />}
            {t("secondFactor.button", { ns: "common" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
