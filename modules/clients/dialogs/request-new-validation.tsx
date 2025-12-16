import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useTranslate } from "@/locales";
import { useState } from "react";

export default function RequestNewValidation() {
  const { t } = useTranslate(["clients"]);
  const [reason, setReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const reasons = [
    { value: "documento-vencido", label: "expiredDocument" },
    { value: "documento-no-legible", label: "unreadableDocument" },
    { value: "foto-no-apropiada", label: "inappropriatePhoto" },
    { value: "nueva-prueba-de-vida", label: "newProofOfLife" },
    { value: "otros", label: "other" },
  ];

  const documents = ["photo", "identification", "business", "legal", "representativePhoto"];

  const handleDocumentChange = (doc: string, checked: boolean) => {
    setSelectedDocuments((prev) => (checked ? [...prev, doc] : prev.filter((d) => d !== doc)));
  };

  const handleSubmit = () => {
    setReason("");
    setOtherReasonText("");
    setSelectedDocuments([]);
  };

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button className="mt-4">{t("kycTab.form.solicitar", { ns: "clients" })}</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("kycTab.form.title", { ns: "clients" })}</DialogTitle>
          <DialogDescription>{t("kycTab.form.description", { ns: "clients" })}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">{t("kycTab.form.reason", { ns: "clients" })}</Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder={t("kycTab.form.placeholder", { ns: "clients" })} />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {t(`kycTab.form.reasons.${r.label}`, { ns: "clients" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === "otros" && (
            <div className="grid gap-2">
              <Label htmlFor="other-reason">
                {t("kycTab.form.reasonOther", { ns: "clients" })}
              </Label>
              <Textarea
                id="other-reason"
                placeholder={t("kycTab.form.reasonOtherPlaceholder", { ns: "clients" })}
                value={otherReasonText}
                onChange={(e) => setOtherReasonText(e.target.value)}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label>{t("kycTab.form.documents.title", { ns: "clients" })}</Label>
            {documents.map((doc) => (
              <div key={doc} className="flex items-center space-x-2">
                <Checkbox
                  id={doc}
                  onCheckedChange={(checked) => handleDocumentChange(doc, !!checked)}
                  checked={selectedDocuments.includes(doc)}
                />
                <label
                  htmlFor={doc}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`kycTab.form.documents.documents.${doc}`, { ns: "clients" })}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setReason("")}>
            {t("kycTab.form.cancel", { ns: "clients" })}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {t("kycTab.form.submit", { ns: "clients" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
