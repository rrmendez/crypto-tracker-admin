import { useWallets } from "@/hooks/use-wallets";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useClientsWalletsTableColumns } from "./wallets-table-by-client-columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTranslate } from "@/locales";

export default function ClientsWalletsTable() {
  const { t } = useTranslate(["clients"]);
  const id = useParams().clientId;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { getWalletsByClientsQuery } = useWallets();
  const { data: wallets, isFetching } = getWalletsByClientsQuery(id as string, {
    page,
    limit,
  });

  const columns = useClientsWalletsTableColumns();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = useReactTable<any>({
    data: wallets?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: wallets?.page ?? 1,
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("table.noResults", { ns: "clients" })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {!!wallets && (
          <div className="text-muted-foreground flex-1 text-sm">
            {t("table.page", {
              ns: "clients",
              page: wallets.page,
              totalPages: Math.ceil(wallets.total / limit),
            })}
          </div>
        )}

        <div className="space-x-2">
          <span className="font-semibold text-sm hidden md:inline">
            {t("table.rowPerPage", { ns: "clients" })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:mr-8" size="sm">
                {limit} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 20].map((limitOption) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={limitOption}
                    className="capitalize"
                    checked={limitOption === limit}
                    onCheckedChange={(value) => setLimit(value ? limitOption : 10)}
                  >
                    {limitOption}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1 || isFetching}
          >
            {t("table.previous", { ns: "clients" })}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((old) =>
                !wallets || page >= Math.ceil(wallets.total / limit) ? old : old + 1
              )
            }
            disabled={!wallets || page >= Math.ceil(wallets.total / limit) || isFetching}
          >
            {t("table.next", { ns: "clients" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
