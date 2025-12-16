"use client";

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
import Link from "next/link";
import { useTranslate } from "@/locales";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HouseIcon, MoreVertical, PanelsTopLeftIcon } from "lucide-react";
import SecurityTab from "../tabs/security-tab";
import ProfileTab from "../tabs/profile-tab";

export default function ProfileView() {
  const { t } = useTranslate("profile");
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromQuery = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(tabFromQuery);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", newTab);
    router.push(`?${current.toString()}`);
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "profile":
        return "profileView.tabProfile";
      default:
        return "profileView.tabSecurity";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={paths.dashboard.root}>{t("breadcrumb.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t(getTabLabel(activeTab))}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="gap-2">
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <ScrollArea>
              <button
                type="button"
                className="sm:hidden flex items-center gap-1 p-1 rounded-md bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-white"
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                <MoreVertical size={20} aria-hidden="true" />
              </button>
              <TabsList className="hidden sm:flex mb-3 gap-1 bg-transparent">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  data-[state=active]:shadow-none"
                >
                  <HouseIcon className="me-2 opacity-60" size={16} aria-hidden="true" />
                  {t("profileView.tabProfile")}
                </TabsTrigger>

                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground  data-[state=active]:shadow-none"
                >
                  <PanelsTopLeftIcon className="me-2 opacity-60" size={16} aria-hidden="true" />
                  {t("profileView.tabSecurity")}
                </TabsTrigger>
              </TabsList>

              {isOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={() => setIsOpen(false)}
                >
                  <nav
                    className="absolute top-0 left-0 h-full w-64  p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="mb-4"
                      onClick={() => setIsOpen(false)}
                      aria-label="Cerrar menú"
                    >
                      ✕
                    </button>
                    <ul className="flex flex-col gap-4">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab("profile");
                            setIsOpen(false);
                          }}
                        >
                          <HouseIcon
                            className="me-2 opacity-60 inline"
                            size={16}
                            aria-hidden="true"
                          />
                          {t("profileView.tabProfile")}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab("security");
                            setIsOpen(false);
                          }}
                        >
                          <PanelsTopLeftIcon
                            className="me-2 opacity-60 inline"
                            size={16}
                            aria-hidden="true"
                          />
                          {t("profileView.tabSecurity")}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <ProfileTab />
            <SecurityTab />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
