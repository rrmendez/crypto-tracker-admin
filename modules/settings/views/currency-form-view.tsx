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
import { useParams } from "@/routes/hooks";
import CurrencyForm from "../currencies/form";
import { useTranslate } from "@/locales";

// -------------------------------------------------------------------------------

export default function CurrenciesFormView() {
  const params = useParams();
  const { t } = useTranslate(["currencies"]);

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>{t("breadcrumb.home", { ns: "currencies" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.settings.root}>
                {t("breadcrumb.settings", { ns: "currencies" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.settings.currencies.root}>
                {t("breadcrumb.currencies", { ns: "currencies" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {params.id
                ? t("breadcrumb.edit", { ns: "currencies" })
                : t("breadcrumb.create", { ns: "currencies" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CurrencyForm currencyId={params.id as string} />
    </div>
  );
}
