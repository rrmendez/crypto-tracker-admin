import React from "react";
import { KYCDocumentVm } from "@/types";
import { FileText, ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/locales";
import { format } from "date-fns";

type DocumentListProps = {
  documents: KYCDocumentVm[];
};

export default function DocumentList({ documents }: DocumentListProps) {
  const { t } = useTranslate(["clients"]);

  const pendingDocs = documents.filter((d) => d.status === "PENDING");
  const rejectedDocs = documents.filter((d) => d.status === "REJECTED");
  const validatedDocs = documents.filter((d) => d.status === "VALIDATED");

  const renderSection = (title: string, docs: KYCDocumentVm[]) => {
    if (docs.length === 0) return null;
    return (
      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-4 p-0">
          <p className={`font-bold text-sm`}>{title}</p>

          <div className="flex flex-col gap-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-2 rounded-md shadow-sm bg-white dark:bg-zinc-900"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-muted dark:bg-zinc-800 border">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-base font-semibold text-foreground">
                    {doc.description ||
                      t("documentList.documentFallback", { ns: "clients", type: doc.type })}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      {t("documentList.uploaded", { ns: "clients" })}:
                    </span>{" "}
                    {format(new Date(doc.createdAt), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>

                <Button asChild variant="ghost" className="flex items-center gap-1 text-sm h-auto">
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    {t("documentList.viewFile", { ns: "clients" })}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-6">
        {renderSection(t("complianceDetails.status.PENDING", { ns: "compliance" }), pendingDocs)}

        {renderSection(
          t("complianceDetails.status.VALIDATED", { ns: "compliance" }),
          validatedDocs
        )}

        {renderSection(t("complianceDetails.status.REJECTED", { ns: "compliance" }), rejectedDocs)}
      </div>
    </div>
  );
}
