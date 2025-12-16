"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/routes/paths";
import Link from "next/link";
import { WithdrawalsTable } from "../withdrawals/withdrawals-table";
import { useTranslate } from "@/locales";

export function WithdrawalsListView() {
  const { t } = useTranslate(["transactions"]);

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("withdrawalsListView.breadcrumb.home", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.transactions.root}>
                {t("withdrawalsListView.breadcrumb.transactions", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {t("withdrawalsListView.breadcrumb.withdrawals", { ns: "transactions" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("withdrawalsListView.title", { ns: "transactions" })}</CardTitle>
          <CardDescription>
            {t("withdrawalsListView.description", { ns: "transactions" })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <WithdrawalsTable />
        </CardContent>
      </Card>
    </div>
  );
}
