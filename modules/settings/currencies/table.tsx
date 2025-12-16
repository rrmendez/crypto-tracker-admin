"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  BookUser,
  CalendarClock,
  ChevronDown,
  CircleCheckBig,
  CircleOff,
  DecimalsArrowRight,
  GlobeLock,
  Landmark,
  MoreHorizontal,
  RefreshCcw,
  WalletMinimal,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Currency } from "@/types";
import { fDateTime } from "@/utils/format-time";
import { useCurrencies } from "@/hooks/use-currencies";
import { paths } from "@/routes/paths";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/custom/modals";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslate } from "@/locales";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useTableFilters } from "@/hooks/use-table-filters";

// ---------------------------------------------------------------------------

export function CurrenciesTable() {
  const { t } = useTranslate(["currencies", "transactions"]);

  const defaultFilters = {
    page: 1,
    limit: 10,
    composerSearch: "",
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "currencies-table",
    defaultFilters,
    "/settings/currencies"
  );

  const { page, limit, composerSearch } = filters;

  const [enableCurrencyId, setEnableCurrencyId] = useState<string>();
  const [disableCurrencyId, setDisableCurrencyId] = useState<string>();

  const { getCurrencies, enableOrDisable, syncPrice } = useCurrencies();

  const { data, isFetching } = getCurrencies({
    page,
    limit,
    orderBy: "createdAt",
    order: "DESC",
    composerSearch,
  });

  const columns: ColumnDef<Currency>[] = [
    {
      accessorKey: "name",
      header: t("columns.information", { ns: "currencies" }),
      cell: ({ row }) => {
        const currency = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{currency.name}</span>
            <span className="text-sm text-muted-foreground">{currency.code}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: " ",
      cell: ({ row }) => {
        const currency = row.original;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <WalletMinimal size={16} />
              {currency.type}
            </div>
            <div className="flex items-center gap-2">
              {currency.type === "CRYPTO" ? (
                <>
                  <GlobeLock size={16} />
                  {t("network." + currency.network)}
                </>
              ) : currency.type === "FIAT" ? (
                <>
                  <Landmark size={16} />
                  {currency.symbol}
                </>
              ) : (
                <>
                  <DecimalsArrowRight size={16} />
                  {currency.decimals}
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: " ",
      cell: ({ row }) => {
        const currency = row.original;

        return (
          <div className="flex flex-col">
            <div
              className={cn(
                "flex items-center gap-2",
                currency.isActive ? "text-primary" : "text-destructive"
              )}
            >
              {currency.isActive ? <CircleCheckBig size={16} /> : <CircleOff size={16} />}
              {currency.isActive
                ? t("type.active", { ns: "currencies" })
                : t("type.inactive", { ns: "currencies" })}
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock size={16} />
              {fDateTime(currency.updatedAt)}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const currency = row.original;

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
                  onClick={() =>
                    navigateWithSavedFilters(
                      "currencies-table",
                      filters,
                      paths.settings.currencies.details(currency.id)
                    )
                  }
                >
                  <BookUser />
                  {t("actions.details", { ns: "currencies" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigateWithSavedFilters(
                      "currencies-table",
                      filters,
                      paths.settings.currencies.edit(currency.id)
                    )
                  }
                >
                  <WalletMinimal />
                  {t("actions.edit", { ns: "currencies" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => syncPrice.mutateAsync(currency.id)}
                  disabled={syncPrice.isPending}
                >
                  <RefreshCcw />
                  {t("actions.sync_price", { ns: "currencies" })}
                </DropdownMenuItem>
                {!currency.isActive ? (
                  <DropdownMenuItem onClick={() => setEnableCurrencyId(currency.id)}>
                    <CircleCheckBig />
                    {t("actions.active", { ns: "currencies" })}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDisableCurrencyId(currency.id)}
                  >
                    <CircleOff />
                    {t("actions.inative", { ns: "currencies" })}
                  </DropdownMenuItem>
                )}
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

  const handleSearch = useDebouncedCallback((search: string) => {
    setFilters({ composerSearch: search, page: 1 });
  }, 1000);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
        <Input
          placeholder={t("filters.search", { ns: "currencies" })}
          className="max-w-sm"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={composerSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setFilters({ composerSearch: (e.target as HTMLInputElement).value, page: 1 });
            }
          }}
        />
      </div>
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
                  {t("depositsTable.empty", { ns: "transactions" })}
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
                {t("depositsTable.pagination.page", { ns: "transactions" })} {data.page}{" "}
                {t("depositsTable.pagination.of", { ns: "transactions" })}{" "}
                {Math.ceil(data.total / limit)}
              </div>
            )}

            <div className="space-x-2">
              <span className="font-semibold text-sm hidden md:inline">
                {t("depositsTable.pagination.rowsPerPage", { ns: "transactions" })}:
              </span>{" "}
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
                        onCheckedChange={(value) =>
                          setFilters({ limit: value ? limitOption : 10, page: 1 })
                        }
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
                onClick={() => setFilters({ page: Math.max(page - 1, 1) })}
                disabled={page === 1 || isFetching}
              >
                {t("depositsTable.pagination.previous", { ns: "transactions" })}
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
                {t("depositsTable.pagination.next", { ns: "transactions" })}
              </Button>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        title={t("modal.titleActivate", { ns: "currencies" })}
        open={!!enableCurrencyId}
        onConfirm={async () => {
          await enableOrDisable.mutateAsync({
            id: enableCurrencyId ?? "",
            isActive: true,
          });
          setEnableCurrencyId(undefined);
        }}
        onCancel={() => setEnableCurrencyId(undefined)}
        loading={enableOrDisable.isPending}
      >
        <div className="text-sm text-muted-foreground">
          {t("modal.contentActivate", { ns: "currencies" })}
        </div>
      </ConfirmModal>

      <ConfirmModal
        title={t("modal.titleInactive", { ns: "currencies" })}
        open={!!disableCurrencyId}
        onConfirm={async () => {
          await enableOrDisable.mutateAsync({
            id: disableCurrencyId ?? "",
            isActive: false,
          });
          setDisableCurrencyId(undefined);
        }}
        onCancel={() => setDisableCurrencyId(undefined)}
        loading={enableOrDisable.isPending}
      >
        <div className="text-sm text-muted-foreground">
          {t("modal.contentInactive", { ns: "currencies" })}
        </div>
      </ConfirmModal>
    </div>
  );
}
