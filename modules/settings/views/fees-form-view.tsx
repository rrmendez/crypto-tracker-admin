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
import FeesForm from "../fees/form";
import { useTranslate } from "@/locales";

export default function FeesFormView() {
  const { t } = useTranslate(["fees"]);
  const params = useParams();

  const isEdit = Boolean(params.id);

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("feesFormView.breadcrumb.home", { ns: "fees" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.settings.root}>
                {t("feesFormView.breadcrumb.settings", { ns: "fees" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.settings.fees.root}>
                {t("feesFormView.breadcrumb.fees", { ns: "fees" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit
                ? t("feesFormView.edit", { ns: "fees" })
                : t("feesFormView.create", { ns: "fees" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FeesForm feeId={params.id as string} />
    </div>
  );
}
