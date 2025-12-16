"use client";

import { useKycs } from "@/hooks/use-kycs";
import { fDateTime } from "@/utils/format-time";
import { ArrowLeft, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import DocumentList from "../clients-documents-list";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ApprovalModal from "../dialogs/approval-modal";
import CompleteRejection from "../dialogs/complete-rejection";
import { useTranslate } from "@/locales";
import CorrectDocuments from "../dialogs/correct-documents";

export default function ClientDetailsKYCViews() {
  const kycId = useParams().kycId;
  const { getKycsDetails } = useKycs();
  const { t } = useTranslate(["clients", "compliance"]);

  const { data: kyc, isLoading } = getKycsDetails(kycId as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            {t("clientDetailsKycViews.loading", { ns: "clients" })}
          </p>
        </div>
      </div>
    );
  }

  if (!kyc) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        {t("clientDetailsKycViews.noDetails", { ns: "clients" })}
      </div>
    );
  }

  const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: "default",
    APPROVED: "default",
    REJECTED: "destructive",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            aria-label={t("clientDetailsKycViews.back", { ns: "clients" })}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">
            {t("clientDetailsKycViews.title", { ns: "clients" })}
          </h1>
        </div>
        <Badge
          className="capitalize"
          variant={statusVariants[kyc.status as keyof typeof statusVariants]}
        >
          {t(`complianceTable.statusType.${kyc.status}`, {
            ns: "compliance",
          })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("clientDetailsKycViews.requestDate", { ns: "clients" })}
            </h2>
            <p className="font-bold tracking-tight">{fDateTime(kyc.createdAt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("clientDetailsKycViews.updateDate", { ns: "clients" })}
            </h2>
            <p className="font-bold tracking-tight">{fDateTime(kyc.updatedAt)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("clientDetailsKycViews.reason", { ns: "clients" })}
          </h2>
          <div className="flex flex-col space-y-2">
            {kyc.rejectReason ? (
              <p>
                {t(`clientDetailsKycViews.rejectReason.${kyc.rejectReason}`, { ns: "clients" })}
              </p>
            ) : kyc.type === "IDENTITY_PF" || kyc.type === "IDENTITY_PJ" ? (
              <p>{t("clientDetailsKycViews.reasonTitle", { ns: "clients" })}</p>
            ) : (
              <p className="italic text-muted-foreground">
                {t("clientDetailsKycViews.notSpecified", { ns: "clients" })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4 border-t border-border" />
      <h2 className="text-xl font-bold tracking-tight">
        {t("clientDetailsKycViews.documents", { ns: "clients" })}
      </h2>
      <DocumentList documents={kyc.documents || []} />

      <div className="flex items-center justify-end gap-4">
        <CorrectDocuments status={kyc.status} documents={kyc.documents} />
        <CompleteRejection status={kyc.status} />
        <ApprovalModal status={kyc.status} />
      </div>
    </div>
  );
}
