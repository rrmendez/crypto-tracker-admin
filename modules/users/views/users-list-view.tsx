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
import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import Link from "next/link";
import { UsersTable } from "../users-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersListView() {
  const { t } = useTranslate(["users"]);
  const router = useRouter();

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
            <BreadcrumbPage>{t("breadcrumb.users", { ns: "users" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardHeader className="relative">
          <CardTitle>{t("title", { ns: "users" })}</CardTitle>
          <CardDescription></CardDescription>
          <Button
            className="absolute right-3 top-0"
            variant="outline"
            onClick={() => router.push(paths.users.create)}
          >
            <Plus />
            {t("createUser", { ns: "users" })}
          </Button>
        </CardHeader>

        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
