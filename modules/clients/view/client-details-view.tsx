"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { paths } from "@/routes/paths";
import { LockKeyhole, PanelsTopLeftIcon, User2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ClientsProfileTab from "../tabs/clients-profile-tab";
import ClientsKycTab from "../tabs/clients-kyc-tab";
import ClientsSecurityTab from "../tabs/clients-security-tab";
import { useClients } from "@/hooks/use-clients";
import { useTranslate } from "@/locales";

// -------------------------------------------------------------------------------

export default function ClientDetailsView() {
  const { t } = useTranslate(["clients"]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(tabFromQuery);

  const { getDetails } = useClients();
  const id = useParams().clientId;
  const { data: user, isLoading } = getDetails(id as string);

  useEffect(() => {
    setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", newTab);
    router.push(`?${current.toString()}`);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto scrollableDiv">
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
            <BreadcrumbPage>{user?.email}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb.clientDetails", { ns: "clients" })}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex max-h-[calc(100%-36px)] gap-4">
        <Card
          className={cn("w-full transition-all duration-300 ease-in-out shadow-lg rounded-xl mt-8")}
        >
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <ScrollArea>
                <TabsList className="mb-3 gap-1 bg-transparent">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
                  >
                    <User2 className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                    {t("tabs.profile", { ns: "clients" })}
                  </TabsTrigger>
                  <TabsTrigger
                    value="kyc"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
                  >
                    <PanelsTopLeftIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    {t("tabs.kycKyb", { ns: "clients" })}
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
                  >
                    <LockKeyhole
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    {t("tabs.security", { ns: "clients" })}
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {activeTab === "profile" && <ClientsProfileTab user={user} isLoading={isLoading} />}
              {activeTab === "kyc" && <ClientsKycTab />}
              {activeTab === "security" && <ClientsSecurityTab user={user} />}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
