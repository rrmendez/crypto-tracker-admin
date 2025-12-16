"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { useClients } from "@/hooks/use-clients";
import { paths } from "@/routes/paths";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClientsWalletsTable from "../wallets-table-by-client";
import { useTranslate } from "@/locales";

export default function ClientWalletsListView() {
  const { t } = useTranslate(["clients"]);
  const { getDetails } = useClients();
  const id = useParams().clientId;
  const { data: user } = getDetails(id as string);
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
            <BreadcrumbLink asChild>
              <Link href={paths.clients.root}>{t("breadcrumb.clients", { ns: "clients" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <BreadcrumbPage>{user?.email}</BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb.wallets", { ns: "clients" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="gap-2">
        <CardContent>
          <ClientsWalletsTable />
        </CardContent>
      </Card>
    </div>
  );
}
