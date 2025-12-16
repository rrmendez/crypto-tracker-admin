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
import { DepositsTable } from "../deposits/deposits-table";
import { useTranslate } from "@/locales";

export function DepositListView() {
  const { t } = useTranslate(["transactions"]);

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>
                {t("depositListView.breadcrumb.home", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.transactions.root}>
                {t("depositListView.breadcrumb.transactions", { ns: "transactions" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {t("depositListView.breadcrumb.deposits", { ns: "transactions" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("depositListView.title", { ns: "transactions" })}</CardTitle>
          <CardDescription>
            {t("depositListView.description", { ns: "transactions" })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DepositsTable />
        </CardContent>
      </Card>
    </div>
  );
}
