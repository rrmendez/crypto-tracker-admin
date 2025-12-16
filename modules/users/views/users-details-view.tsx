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
import { useParams } from "@/routes/hooks";
import { useTranslate } from "@/locales";
import DetailsForm from "../details-form";

export default function UsersDetailsView() {
  const { t } = useTranslate(["users"]);
  const params = useParams();

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>{t("breadcrumb.home", { ns: "users" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.users.root}>{t("breadcrumb.users", { ns: "users" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb.details", { ns: "users" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DetailsForm userId={params.userId as string} />
    </div>
  );
}
