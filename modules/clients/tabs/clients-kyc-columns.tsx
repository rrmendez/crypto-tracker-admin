import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KYCResponseVm } from "@/types";
import { fDateTime } from "@/utils/format-time";
import { ColumnDef } from "@tanstack/react-table";
import { BookUser, MoreHorizontal } from "lucide-react";
import { paths } from "@/routes/paths";
import { useParams, useRouter } from "next/navigation";
import { useTranslate } from "@/locales";

export function useKycColumns(): ColumnDef<KYCResponseVm>[] {
  const router = useRouter();
  const clientId = useParams().clientId;

  const { t } = useTranslate(["common", "clients"]);

  return [
    {
      accessorKey: "createdAt",
      header: t("kycTab.table.createdAt", { ns: "clients" }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">{fDateTime(row.original.createdAt)}</div>
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: t("kycTab.table.updatedAt", { ns: "clients" }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">{fDateTime(row.original.updatedAt)}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("kycTab.table.state", { ns: "clients" }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Badge variant="outline" className="flex items-center gap-2">
            <span className="text-[12px] font-medium">
              {t("operations.status." + row.original.status, { ns: "common" })}
            </span>
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: t("kycTab.table.createdBy", { ns: "clients" }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">{row.original.createdBy}</div>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const kyc = row.original;

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
                  onClick={() => router.push(paths.clients.kycDetals(clientId as string, kyc.id))}
                >
                  <BookUser className="mr-2 h-4 w-4" />
                  {t("kycTab.table.actions", { ns: "clients" })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
