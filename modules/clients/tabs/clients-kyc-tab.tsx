import { TabsContent } from "@/components/ui/tabs";
import { useKycs } from "@/hooks/use-kycs";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKycColumns } from "./clients-kyc-columns";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslate } from "@/locales";

export default function ClientsKycTab() {
  const { t } = useTranslate(["clients"]);
  const clientId = useParams().clientId;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const columns = useKycColumns();

  const { getKycsClient } = useKycs();
  const { data, isFetching } = getKycsClient(
    {
      page,
      limit,
      orderBy: "createdAt",
      order: "DESC",
    },
    clientId as string
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.page ?? 1,
  });

  return (
    <TabsContent value="kyc" className="mt-4">
      <Card>
        <CardContent>
          <div className="p-4 sm:p-6 space-y-4">
            {/* <div className="flex items-center justify-end py-2">
              <RequestNewValidation />
            </div> */}
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
            <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-2 space-y-2 md:space-y-0 py-4">
              {!!data && (
                <div className="text-muted-foreground text-sm text-center md:text-left flex-1">
                  {t("table.page", {
                    ns: "clients",
                    page: data.page,
                    totalPages: Math.ceil(data.total / limit),
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
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
                      !data || page >= Math.ceil(data.total / limit) ? old : old + 1
                    )
                  }
                  disabled={!data || page >= Math.ceil(data.total / limit) || isFetching}
                >
                  {t("table.next", { ns: "clients" })}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
