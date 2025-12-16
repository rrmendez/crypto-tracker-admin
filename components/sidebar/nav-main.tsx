import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "@/routes/hooks";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTranslate } from "@/locales";

// --------------------------------------------------------------------------------

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { t } = useTranslate();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.items && item.items.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={pathname.includes(item.url)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} className="hover:bg-primary/10">
                        {item.icon && <item.icon />}
                        <span>{t(`navbar.${item.title}`, { ns: "common" })}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={cn(
                              pathname.includes(subItem.url) &&
                                "bg-primary/10 text-primary rounded-md"
                            )}
                          >
                            <SidebarMenuSubButton asChild className="hover:bg-primary/10">
                              <Link href={subItem.url}>
                                <span>{t(`navbar.${subItem.title}`, { ns: "common" })}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem
                key={item.url}
                className={cn(
                  pathname.includes(item.url) && "bg-primary/10 text-primary rounded-md"
                )}
              >
                <SidebarMenuButton asChild className="hover:bg-primary/10">
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{t(`navbar.${item.title}`, { ns: "common" })}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
