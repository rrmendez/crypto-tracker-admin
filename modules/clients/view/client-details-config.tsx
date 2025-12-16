"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/routes/paths";
import Link from "next/link";
import { useLimits } from "@/hooks/use-limits";
import { useParams } from "next/navigation";
import { OperationsAccordion } from "../limits-operations-accordion";
import { useTranslate } from "@/locales";

export default function ClientDetailsConfig() {
  const { t } = useTranslate("limits");
  const params = useParams();

  const { getLimitsByClient } = useLimits();
  const { data: limits, isLoading } = getLimitsByClient(params.clientId as string);
  if (isLoading) {
    return null;
  }
  return (
    <div className="p-6 space-y-6 overflow-y-auto scrollableDiv min-h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>{t("breadcrumb.init", { ns: "limits" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.clients.root}>{t("breadcrumb.clients", { ns: "limits" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb.settings", { ns: "limits" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className=" ">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold ">
            {t("accountLimits", { ns: "limits" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" mx-auto p-4">
            <OperationsAccordion data={limits?.data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
