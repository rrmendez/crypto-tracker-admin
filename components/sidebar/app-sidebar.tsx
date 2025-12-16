"use client";

import * as React from "react";
import { Cog, Component, Contact, DollarSign, LayoutDashboard, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { paths } from "@/routes/paths";
import { NavMain } from "./nav-main";
import {
  AppLogo,
  AppLogoDark,
  AppLogoWithTextHorizontal,
  AppLogoWithTextHorizontalDark,
} from "../custom/vectors";
import { useTheme } from "next-themes";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: paths.dashboard.root,
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Clientes",
      url: paths.clients.root,
      icon: Contact,
      isActive: true,
      items: [],
    },
    {
      title: "Compliance",
      url: paths.compliance.root,
      icon: Component,
      isActive: true,
      items: [],
    },
    {
      title: "Transacciones",
      url: paths.transactions.root,
      icon: DollarSign,
      items: [
        {
          title: "Depositos",
          url: paths.transactions.deposits.root,
          items: [],
        },
        {
          title: "Transferencias",
          url: paths.transactions.withdrawals.root,
          items: [],
        },
      ],
    },
    // {
    //   title: "Vendas",
    //   url: paths.sales.root,
    //   icon: ShoppingBasket,
    //   items: [],
    // },
    {
      title: "Usuarios",
      url: paths.users.root,
      icon: Users,
      items: [],
    },
    {
      title: "Settings",
      url: paths.settings.root,
      icon: Cog,
      items: [
        {
          title: "Currencies",
          url: paths.settings.currencies.root,
          items: [],
        },
        {
          title: "Taxas",
          url: paths.settings.fees.root,
          items: [],
        },
        {
          title: "Límites",
          url: paths.settings.limits.root,
          items: [],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <LogoAndName />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}

// --------------------------------------------------------------------------------

export function LogoAndName() {
  const { resolvedTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex items-center gap-3">
            {resolvedTheme === "dark" ? (
              <AppLogoWithTextHorizontalDark className="hidden md:block h-8" />
            ) : (
              <AppLogoWithTextHorizontal className="hidden md:block h-8" />
            )}

            {resolvedTheme === "dark" ? (
              <AppLogoDark className="md:hidden size-10" />
            ) : (
              <AppLogo className="md:hidden size-10" />
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
