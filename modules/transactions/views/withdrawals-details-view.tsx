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
import WithdrawalsDetails from "../withdrawals/withdrawals-details";
import { useTranslate } from "@/locales";

export default function WithdrawalsDetailsView() {
  const { t } = useTranslate(["transactions"]);
  const params = useParams();

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("withdrawalsDetailsView.breadcrumb.home", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.transactions.root}>
                {t("withdrawalsDetailsView.breadcrumb.transactions", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.transactions.withdrawals.root}>
                {t("withdrawalsDetailsView.breadcrumb.withdrawals", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {t("withdrawalsDetailsView.breadcrumb.details", { ns: "transactions" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <WithdrawalsDetails backPath="/transactions/withdrawals" depositId={params.id as string} />
    </div>
  );
}
