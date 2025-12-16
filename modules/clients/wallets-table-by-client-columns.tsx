import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import { Wallet } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { BookUser, MoreHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export function useClientsWalletsTableColumns(): ColumnDef<Wallet>[] {
  const { t } = useTranslate(["clients"]);
  const router = useRouter();
  const id = useParams().clientId;
  return [
    {
      accessorKey: "currency",
      header: t("wallets.table.wallet", { ns: "clients" }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <p className="flex items-center gap-2">{row.original.currency.name}</p>
          <div className="flex items-center  gap-2">
            <p className="text-sm text-muted-foreground">{row.original.currency.code}</p>
            <Badge variant="default" className="text-xs">
              {row.original.currency.network}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "balance",
      header: t("wallets.table.balance", { ns: "clients" }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">{row.original.balance}</div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const wallet = row.original;

        return (
          <div className="flex justify-end md:pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(paths.clients.walletsDetails(String(id), wallet.id))}
                >
                  <BookUser className="mr-2 h-4 w-4" />
                  {t("wallets.table.actions", { ns: "clients" })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
