"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFees } from "@/hooks/use-fees";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { paths } from "@/routes/paths";
import { useTranslate } from "@/locales";

type Props = {
  feeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FeesDelete({ feeId, open, onOpenChange }: Props) {
  const { t } = useTranslate(["fees"]);
  const router = useRouter();
  const { deleteFeeQuery } = useFees();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteFeeQuery.mutateAsync(feeId);
      toast.success(t("feesDelete.success", { ns: "fees" }));
      onOpenChange(false);
      router.push(paths.settings.fees.root);
    } catch (err) {
      console.error(err);
      toast.error(t("feesDelete.error", { ns: "fees" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("feesDelete.title", { ns: "fees" })}</DialogTitle>
          <DialogDescription>{t("feesDelete.description", { ns: "fees" })}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t("feesDelete.cancel", { ns: "fees" })}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("feesDelete.confirm", { ns: "fees" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
