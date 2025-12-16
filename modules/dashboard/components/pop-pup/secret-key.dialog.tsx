"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import CommingSoon from "@/modules/comming-soon";

type SecretKeyDialogProps = {
  open: boolean;
  onClose: () => void;
};
export default function SecretKeyDialog({ open, onClose }: SecretKeyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Llave secreta</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <CommingSoon />
      </DialogContent>
    </Dialog>
  );
}
