"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  description,
  children,
  open,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter className="flex gap-x-4 justify-end">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm} disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
