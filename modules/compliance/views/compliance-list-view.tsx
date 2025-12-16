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
import { useTranslate } from "@/locales";
import ComplianceTable from "../compliance-table";

export default function ComplianceListView() {
  const { t } = useTranslate(["compliance"]);
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
              {t("complianceListView.breadcrumb.compliance", { ns: "compliance" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("complianceListView.title", { ns: "compliance" })}</CardTitle>
          <CardDescription>
            {t("complianceListView.description", { ns: "compliance" })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ComplianceTable />
        </CardContent>
      </Card>
    </div>
  );
}
