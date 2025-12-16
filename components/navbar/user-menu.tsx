"use client";

import { LogOutIcon, ShieldCheck, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfile from "@/hooks/use-profile";
import { useAuthStore } from "@/stores/authStore";
import { useTranslate } from "@/locales";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { t } = useTranslate();
  const router = useRouter();

  const { getProfile } = useProfile();

  const { data: user } = getProfile();

  const { logOut } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* <div className="grid flex-1 text-left text-sm leading-tight max-md:hidden">
            <span className="text-foreground truncate text-xs font-medium">{user?.fullName}</span>
            <span className="text-muted-foreground truncate text-[9px] font-normal">
              {user?.email}
            </span>
          </div> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">{user?.fullName}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile?tab=profile")}>
            <UserCog size={16} className="opacity-60" aria-hidden="true" />
            <span>{t("menu.profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/profile?tab=security")}>
            <ShieldCheck size={16} className="opacity-60" aria-hidden="true" />
            <span>{t("menu.security")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.clear();
            logOut();
          }}
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{t("menu.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
