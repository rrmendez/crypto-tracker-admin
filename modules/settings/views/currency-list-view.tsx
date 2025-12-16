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
import { CurrenciesTable } from "../currencies/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/routes/hooks";
import { useTranslate } from "@/locales";

// -------------------------------------------------------------------------------

export default function CurrenciesListView() {
  const router = useRouter();
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
            <BreadcrumbPage>{t("breadcrumb.currencies", { ns: "currencies" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("breadcrumb.currencies", { ns: "currencies" })}</CardTitle>
          <CardDescription>{t("breadcrumb.subTitle", { ns: "currencies" })}</CardDescription>

          <Button
            className="absolute right-3 top-0"
            variant="outline"
            onClick={() => router.push(paths.settings.currencies.create)}
          >
            <Plus />
            {t("breadcrumb.add", { ns: "currencies" })}
          </Button>
        </CardHeader>

        <CardContent>
          <CurrenciesTable />
        </CardContent>
      </Card>
    </div>
  );
}
