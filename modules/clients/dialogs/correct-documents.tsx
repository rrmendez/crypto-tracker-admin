"use client";

import { DialogFooter } from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useKycs } from "@/hooks/use-kycs";
import { useTranslate } from "@/locales";
import { KYCDocumentVm } from "@/types";
import { getMessageError } from "@/utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type CorrectDocumentsProps = {
  status: string;
  documents: KYCDocumentVm[];
};

export default function CorrectDocuments({ status, documents }: CorrectDocumentsProps) {
  const { t } = useTranslate(["clients"]);

  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [rejectDetails, setRejectDetails] = useState("");
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const kycId = useParams().kycId;
  const { rejectKycPartially } = useKycs();

  const handleCorrect = async () => {
    setError("");

    if (selectedIds.length === 0) {
      setError(t("correctDocuments.error.document", { ns: "clients" }));
      return;
    }

    if (!rejectDetails.trim()) {
      setError(t("correctDocuments.error.reason", { ns: "clients" }));
      return;
    }

    await rejectKycPartially.mutateAsync(
      {
        id: kycId as string,
        documentIds: selectedIds,
        rejectReason: rejectDetails,
      },
      {
        onSuccess: () => {
          toast.success(t("correctDocuments.success", { ns: "clients" }));
          queryClient.invalidateQueries({
            queryKey: ["kycs-details", kycId],
          });
          setIsCorrectModalOpen(false);
          setRejectDetails("");
          setSelectedIds([]);
        },
        onError: (error) => {
          const message = getMessageError(error);
          setError(message);
        },
      }
    );
  };

  const handleToggle = (id: string, checked: boolean | "indeterminate") => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <Dialog open={isCorrectModalOpen} onOpenChange={setIsCorrectModalOpen} modal={true}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={status !== "PENDING"}>
          {t("correctDocuments.title", { ns: "clients" })}
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("correctDocuments.title", { ns: "clients" })}</DialogTitle>
          <DialogDescription>
            {t("correctDocuments.description", { ns: "clients" })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="p-2">
            {documents
              .filter((doc) => doc.status === "PENDING")
              .map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={doc.id}
                    checked={selectedIds.includes(doc.id)}
                    onCheckedChange={(checked) => handleToggle(doc.id, checked)}
                  />
                  <label
                    htmlFor={doc.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {doc.description} ({doc.extension.toUpperCase()})
                  </label>

                  <Button
                    asChild
                    variant="ghost"
                    className="flex items-center gap-1 text-sm h-auto ml-auto"
                  >
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      {t("correctDocuments.see", { ns: "clients" })}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="details">{t("correctDocuments.labelMotive", { ns: "clients" })}</Label>
            <Textarea
              id="details"
              placeholder={t("correctDocuments.placeholderMotive", { ns: "clients" })}
              value={rejectDetails}
              onChange={(e) => {
                setRejectDetails(e.target.value);
                setError("");
              }}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCorrectModalOpen(false)}>
            {t("correctDocuments.cancel", { ns: "clients" })}
          </Button>
          <Button
            onClick={handleCorrect}
            className="flex items-center gap-2"
            disabled={rejectKycPartially.isPending}
          >
            {rejectKycPartially.isPending && <Loader2 className="animate-spin" />}
            {t("correctDocuments.confirm", { ns: "clients" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
