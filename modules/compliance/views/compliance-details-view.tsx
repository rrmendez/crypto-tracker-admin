"use client";
import ComplianceDetails from "../compliance-details";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";
import { paths } from "@/routes/paths";
import { useTranslate } from "@/locales";
import { useKycs } from "@/hooks/use-kycs";

export default function ComplianceDetailsView() {
  const { t } = useTranslate(["compliance"]);
  const params = useParams();

  const { getKycsDetails } = useKycs();

  const complianceId = params.kycId as string;

  const { data: compliance } = getKycsDetails(complianceId);

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("complianceListView.breadcrumb.home", { ns: "compliance" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link href={paths.compliance.root}>
                {t("complianceListView.breadcrumb.compliance", { ns: "compliance" })}
              </Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{compliance?.user.email}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("details", { ns: "compliance" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ComplianceDetails complianceId={complianceId} />
    </div>
  );
}
