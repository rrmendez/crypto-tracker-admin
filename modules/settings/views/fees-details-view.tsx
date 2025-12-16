"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { paths } from "@/routes/paths";
import Link from "next/link";
import { useParams } from "next/navigation";
import FeesDetails from "../fees/details";
import { useTranslate } from "@/locales";

export default function FeesDetailsView() {
  const { t } = useTranslate(["fees"]);
  const params = useParams();
  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("feesListView.breadcrumb.home", { ns: "fees" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.settings.root}>
                {t("feesListView.breadcrumb.settings", { ns: "fees" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.settings.fees.root}>
                {t("feesListView.breadcrumb.fees", { ns: "fees" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("feesDetails.detailsTitle", { ns: "fees" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <FeesDetails feeId={params.id as string} />
    </div>
  );
}
