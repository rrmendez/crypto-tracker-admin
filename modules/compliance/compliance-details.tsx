"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKycs } from "@/hooks/use-kycs";
import { useTranslate } from "@/locales";
import { fDateTime } from "@/utils/format-time";
import { ChevronRight, ExternalLink, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import CompleteRejection from "../clients/dialogs/complete-rejection";
import ApprovalModal from "../clients/dialogs/approval-modal";
import CorrectDocuments from "../clients/dialogs/correct-documents";
import { KYCDocumentVm } from "@/types";

type ComplianceDetailsProps = {
  complianceId: string;
};

export default function ComplianceDetails({ complianceId }: ComplianceDetailsProps) {
  const { getKycsDetails } = useKycs();
  const router = useRouter();
  const { t } = useTranslate(["compliance", "clients"]);

  const { data: compliance, isLoading, isError } = getKycsDetails(complianceId);

  const renderDetails = useMemo(() => {
    if (!compliance) return null;

    const pendingDocs = compliance.documents.filter((d) => d.status === "PENDING");
    const rejectedDocs = compliance.documents.filter((d) => d.status === "REJECTED");
    const validatedDocs = compliance.documents.filter((d) => d.status === "VALIDATED");

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

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {doc.description}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    className="flex items-center gap-1 text-sm h-auto"
                  >
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
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">
          {t("complianceDetails.title", { ns: "compliance" })}
        </h1>

        <Card className="border-0 bg-muted rounded-md p-1 px-2">
          <CardContent className="flex flex-col gap-3 p-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {t("complianceDetails.status.label", { ns: "compliance" })}
              </span>
              <span className="text-sm">
                {t(`complianceDetails.status.${compliance.status}`, { ns: "compliance" })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {t("complianceDetails.createdAt", { ns: "compliance" })}
              </span>
              <span className="text-sm">{fDateTime(compliance.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {t("complianceDetails.updatedAt", { ns: "compliance" })}
              </span>
              <span className="text-sm">{fDateTime(compliance.updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {t("complianceTable.updatedBy", { ns: "compliance" })}:
              </span>
              <span className="text-sm">{compliance.updatedBy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted rounded-md p-1 px-2">
          <CardContent className="flex flex-col gap-3 p-0">
            <p className="font-bold text-sm">
              {t("complianceDetails.userInfo.title", { ns: "compliance" })}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {t("complianceDetails.userInfo.name", { ns: "compliance" })}
              </span>
              <span className="text-sm">{compliance.user.fullName}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {t("complianceDetails.userInfo.email", { ns: "compliance" })}
              </span>
              <span className="text-sm">{compliance.user.email}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {t("complianceDetails.userInfo.phone", { ns: "compliance" })}
              </span>
              <span className="text-sm">{compliance.user.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted rounded-md p-1 px-2">
          <CardContent className="flex flex-col gap-3 p-0">
            <div>
              <span className="text-sm font-bold">
                {t("clientDetailsKycViews.reason", { ns: "clients" })}
              </span>
              <span className="text-sm">
                {compliance.rejectReason ? (
                  <p>
                    {t(`clientDetailsKycViews.rejectReason.${compliance.rejectReason}`, {
                      ns: "clients",
                    })}
                  </p>
                ) : compliance.type === "IDENTITY_PF" || compliance.type === "IDENTITY_PJ" ? (
                  <p>{t("clientDetailsKycViews.reasonTitle", { ns: "clients" })}</p>
                ) : (
                  <p className="italic text-muted-foreground">
                    {t("clientDetailsKycViews.notSpecified", { ns: "clients" })}
                  </p>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {renderSection(t("complianceDetails.status.PENDING", { ns: "compliance" }), pendingDocs)}

          {renderSection(
            t("complianceDetails.status.VALIDATED", { ns: "compliance" }),
            validatedDocs
          )}

          {renderSection(
            t("complianceDetails.status.REJECTED", { ns: "compliance" }),
            rejectedDocs
          )}
        </div>
      </div>
    );
  }, [compliance, t]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent>
        {isLoading && <DetailsSkeleton />}
        {isError && (
          <div className="text-sm text-destructive">
            {t("complianceDetails.error.loading", { ns: "compliance" })}
          </div>
        )}
        {!isLoading && !isError && renderDetails}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-end w-full">
          <Button onClick={() => router.push("/compliance")} variant="outline">
            {t("complianceDetails.actions.close", { ns: "compliance" })}
          </Button>
          <div className="space-x-2">
            {compliance && (
              <>
                <CorrectDocuments status={compliance.status} documents={compliance.documents} />
                <CompleteRejection status={compliance.status} />
                <ApprovalModal status={compliance.status} />
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function DetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>

      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-3 p-0">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-muted rounded-md p-3">
        <CardContent className="flex flex-col gap-3 p-0">
          {[1, 2].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="secondary" className="w-full font-normal" disabled>
        <Skeleton className="h-4 w-28" />
        <ChevronRight className="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </div>
  );
}
