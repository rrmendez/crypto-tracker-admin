"use client";

import { ClientsTable } from "../clients-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useTranslate } from "@/locales";

// -------------------------------------------------------------------------------

export default function ClientsListView() {
  const { t } = useTranslate(["clients"]);
  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>{t("breadcrumb.home", { ns: "clients" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb.clients", { ns: "clients" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardHeader>
          <CardTitle>{t("breadcrumb.clients", { ns: "clients" })}</CardTitle>
          <CardDescription>{t("listClients", { ns: "clients" })}</CardDescription>
        </CardHeader>

        <CardContent>
          <ClientsTable />
        </CardContent>
      </Card>
    </div>
  );
}
