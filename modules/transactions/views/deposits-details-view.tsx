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
import DepositsDetails from "../deposits/deposits-details";
import { useTranslate } from "@/locales";

export default function DepositsDetailsView() {
  const { t } = useTranslate(["transactions"]);
  const params = useParams();

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("depositsDetailsView.breadcrumb.home", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.transactions.root}>
                {t("depositsDetailsView.breadcrumb.transactions", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.transactions.deposits.root}>
                {t("depositsDetailsView.breadcrumb.deposits", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {t("depositsDetailsView.breadcrumb.details", { ns: "transactions" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DepositsDetails backPath="/transactions/deposits" depositId={params.id as string} />
    </div>
  );
}
