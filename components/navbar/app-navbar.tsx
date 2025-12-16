"use client";

// import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { UserMenu } from "./user-menu";
// import { paths } from "@/routes/paths";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { LayoutDashboard, SettingsIcon, ShoppingBasket } from "lucide-react";
// import { useTranslate } from "@/locales";

// ----------------------------------------------------------------------

// const appPages = [
//   {
//     name: "menu.dashboard",
//     href: paths.dashboard.root,
//     icon: LayoutDashboard,
//     current: true,
//   },
//   {
//     name: "menu.sales",
//     href: paths.sales.root,
//     icon: ShoppingBasket,
//     current: false,
//   },
//   {
//     name: "menu.settings",
//     href: paths.profile.root,
//     icon: SettingsIcon,
//     current: false,
//   },
// ];

export function AppNavbar() {
  // const { t } = useTranslate();

  // const pathname = usePathname();

  // const isActive = (href: string) => pathname.includes(href);

  return (
    <header className="bg-background rounded-t-2xl">
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        {/* Left side */}
        <div className="flex max-md:flex-1 items-center gap-2">
          <SidebarTrigger />
          {/* <SidebarTrigger /> */}
        </div>
        {/* Center */}
        {/* <div className="flex flex-1 items-center justify-center gap-8 h-full">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              {appPages.map((page) => (
                <NavigationMenuItem
                  key={page.name}
                  className={cn(
                    "h-16 flex items-center justify-center",
                    isActive(page.href) &&
                      "border-b-3 border-primary text-muted-foreground font-medium"
                  )}
                >
                  <NavigationMenuLink asChild>
                    <Link href={page.href} className="h-full flex justify-center">
                      {t(page.name)}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div> */}
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
