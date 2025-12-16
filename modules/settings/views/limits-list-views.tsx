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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/routes/hooks";
import { LimitsTable } from "../limits/table";
import { useTranslate } from "@/locales";

export default function LimitsListView() {
  const router = useRouter();
  const { t } = useTranslate(["limits"]);
  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Limits</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("cardTitle", { ns: "limits" })}</CardTitle>
          <CardDescription>{t("cardDescription", { ns: "limits" })}</CardDescription>

          <Button
            className="absolute right-3 top-0"
            variant="outline"
            onClick={() => router.push(paths.settings.limits.create)}
          >
            <Plus />
            {t("config", { ns: "limits" })}
          </Button>
        </CardHeader>

        <CardContent>
          <LimitsTable />
        </CardContent>
      </Card>
    </div>
  );
}
