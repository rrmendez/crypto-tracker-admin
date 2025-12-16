"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLimits } from "@/hooks/use-limits";
import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import { Limit } from "@/types/limit";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { BookUser, ChevronDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/custom/modals";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableFilters } from "@/hooks/use-table-filters";

export function LimitsTable() {
  const { t } = useTranslate(["limits"]);

  const defaultFilters = {
    page: 1,
    limit: 10,
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "limits-table",
    defaultFilters,
    "/settings/limits"
  );

  const { page, limit } = filters;
  const [deleteLimitId, setDeleteLimitId] = useState<string>();

  const { getLimits, remove } = useLimits();

  const { data, isFetching } = getLimits({ page, limit, orderBy: "createdAt", order: "DESC" });

  const columns: ColumnDef<Limit>[] = [
    {
      accessorKey: "operation",
      header: t("LimitsTable.table.operation"),
      cell: ({ row }) => {
        const limit = row.original;
        return <p className="flex items-center gap-2">{t("operations." + limit.operation)}</p>;
      },
    },
    {
      accessorKey: "currencyCode",
      header: " ",
    },
    {
      accessorKey: "createdBy",
      header: " ",
    },
    {
      accessorKey: "status",
      header: " ",
      cell: () => {
        return <Badge>{t("LimitsTable.badge.active")}</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const limit = row.original;

        return (
          <div className="flex justify-end md:pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("LimitsTable.menu.open")}</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    navigateWithSavedFilters(
                      "limits-table",
                      filters,
                      paths.settings.limits.edit(limit.id)
                    )
                  }
                >
                  <Pencil />
                  {t("LimitsTable.menu.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigateWithSavedFilters(
                      "limits-table",
                      filters,
                      paths.settings.limits.details(limit.id)
                    )
                  }
                >
                  <BookUser />
                  {t("LimitsTable.menu.details")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteLimitId(limit.id)}>
                  <Trash />
                  {t("LimitsTable.menu.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.page ?? 1,
  });

  const colCount = columns.length;
  const skeletonRows = Array.from({ length: 10 });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching && !data?.data?.length ? (
              skeletonRows.map((_, index) => (
                <TableRow key={index} className="h-12">
                  {Array.from({ length: colCount }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  {t("LimitsTable.table.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        {isFetching && !data ? (
          <>
            <div className="flex-1">
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="space-x-2 flex">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </>
        ) : (
          <>
            {!!data && (
              <div className="text-muted-foreground flex-1 text-sm">
                {t("LimitsTable.pagination.page")} {data.page} {t("LimitsTable.pagination.of")}{" "}
                {Math.ceil(data.total / limit)}
              </div>
            )}

            <div className="space-x-2">
              <span className="font-semibold text-sm hidden md:inline">
                {t("LimitsTable.pagination.rows_per_page")}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="md:mr-8" size="sm">
                    {limit} <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[5, 10, 20].map((limitOption) => (
                    <DropdownMenuCheckboxItem
                      key={limitOption}
                      className="capitalize"
                      checked={limitOption === limit}
                      onCheckedChange={(value) =>
                        setFilters({ limit: value ? limitOption : 10, page: 1 })
                      }
                    >
                      {limitOption}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ page: Math.max(page - 1, 1) })}
                disabled={page === 1 || isFetching}
              >
                {t("LimitsTable.pagination.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    page: !data || page >= Math.ceil(data.total / limit) ? page : page + 1,
                  })
                }
                disabled={!data || page >= Math.ceil(data.total / limit) || isFetching}
              >
                {t("LimitsTable.pagination.next")}
              </Button>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        title={t("LimitsTable.modal.title")}
        open={!!deleteLimitId}
        onConfirm={async () => {
          await remove.mutateAsync(deleteLimitId as string);
          setDeleteLimitId(undefined);
        }}
        onCancel={() => setDeleteLimitId(undefined)}
      >
        <div className="text-sm text-muted-foreground">{t("LimitsTable.modal.confirm_text")}</div>
      </ConfirmModal>
    </div>
  );
}
