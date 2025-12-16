"use client";

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
import FeesTable from "../fees/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function FeesListView() {
  const { t } = useTranslate(["fees"]);
  const router = useRouter();

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
            <BreadcrumbPage>{t("feesListView.breadcrumb.settings", { ns: "fees" })}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("feesListView.breadcrumb.fees", { ns: "fees" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("feesListView.title", { ns: "fees" })}</CardTitle>
          <CardDescription>{t("feesListView.description", { ns: "fees" })}</CardDescription>
          <Button
            className="absolute right-3 top-0"
            variant="outline"
            onClick={() => router.push(paths.settings.fees.create)}
          >
            <Plus />
            {t("feesListView.create", { ns: "fees" })}
          </Button>
        </CardHeader>

        <CardContent>
          <FeesTable />
        </CardContent>
      </Card>
    </div>
  );
}
