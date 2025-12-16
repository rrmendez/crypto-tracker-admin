"use client";

import { Badge } from "@/components/ui/badge";
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
import { useFees } from "@/hooks/use-fees";
import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import { Fee } from "@/types/fees";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  BookUser,
  ChevronDown,
  DollarSign,
  Loader2,
  MoreHorizontal,
  Percent,
  X,
} from "lucide-react";
import { useState } from "react";
import { fNumber } from "@/utils/format-number";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableFilters } from "@/hooks/use-table-filters";
import { ConfirmModal } from "@/components/custom/modals";
import { toast } from "sonner";
import { useCurrencies } from "@/hooks/use-currencies";

export default function FeesTable() {
  const { t } = useTranslate(["fees", "clients", "transactions"]);

  const { getCurrenciesSystem } = useCurrencies();
  const { data: currencies, isLoading: isLoadingCurrencies } = getCurrenciesSystem();

  const defaultFilters: {
    page: number;
    limit: number;
    operation: string | undefined;
    type: string | undefined;
    currencyId: string | undefined;
  } = {
    page: 1,
    limit: 10,
    operation: undefined,
    type: undefined,
    currencyId: undefined,
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "fees-table",
    defaultFilters,
    "/settings/fees"
  );

  const { page, limit, operation, type, currencyId } = filters;

  const operations = [
    {
      value: "DEPOSIT",
      label: t("operationsOptions.DEPOSIT", { ns: "fees" }),
    },
    {
      value: "WITHDRAW",
      label: t("operationsOptions.WITHDRAW", { ns: "fees" }),
    },
    {
      value: "EXCHANGE",
      label: t("operationsOptions.EXCHANGE", { ns: "fees" }),
    },
    {
      value: "SALE",
      label: t("operationsOptions.SALE", { ns: "fees" }),
    },
    {
      value: "PAYMENT",
      label: t("operationsOptions.PAYMENT", { ns: "fees" }),
    },
  ];

  const fees = [
    {
      value: "FIXED",
      label: t("feesOptions.fixedRate", { ns: "fees" }),
    },
    {
      value: "PERCENT",
      label: t("feesOptions.percentageRate", { ns: "fees" }),
    },
  ];

  const [enableFeeId, setEnableFeeId] = useState<string>();

  const { getFeesQuery, deleteFeeQuery } = useFees();
  const { data, isFetching } = getFeesQuery({
    page,
    limit,
    operation,
    type,
    orderBy: "createdAt",
    order: "DESC",
    currencyId,
  });

  const columns: ColumnDef<Fee>[] = [
    {
      accessorKey: "fullName",
      header: t("feesTable.information", { ns: "fees" }),
      cell: ({ row }) => {
        const fee = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-right">
              <span className="font-medium">{t(`operationsOptions.${fee.operation}`)}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{fee?.currency?.code} - </span>
                <span className="text-sm text-muted-foreground">
                  {t("network." + fee?.currency?.network)}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: " ",
      cell: ({ row }) => {
        const fee = row.original;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {fee.type === "FIXED" ? (
                  <>
                    <DollarSign size={16} />
                    <span>{t("feesTable.fixed", { ns: "fees" })}</span>
                  </>
                ) : (
                  <>
                    <Percent size={16} />
                    <span>{t("feesTable.percentage", { ns: "fees" })}</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {fee.type === "FIXED" ? (
                <span>
                  {fNumber(fee.value, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                </span>
              ) : (
                <span>
                  {fNumber(fee.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: " ",
      cell: ({ row }) => {
        const fee = row.original;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge
                className="px-2 py-1 rounded-full text-xs font-medium"
                variant={fee.isActive ? "default" : "destructive"}
              >
                {fee.isActive
                  ? t("feesTable.active", { ns: "fees" })
                  : t("feesTable.inactive", { ns: "fees" })}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const fee = row.original;

        return (
          <>
            <div className="flex justify-end md:pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{t("feesTable.openMenu", { ns: "fees" })}</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigateWithSavedFilters(
                        "fees-table",
                        filters,
                        paths.settings.fees.edit(fee.id!)
                      )
                    }
                  >
                    <BookUser />
                    {t("feesTable.edit", { ns: "fees" })}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigateWithSavedFilters(
                        "fees-table",
                        filters,
                        paths.settings.fees.details(fee.id!)
                      )
                    }
                  >
                    <BookUser />
                    {t("feesTable.viewDetails", { ns: "fees" })}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnableFeeId(fee.id!)}>
                    <BookUser />
                    {t("feesTable.delete", { ns: "fees" })}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
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
      <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
        <Select
          value={operation ?? ""}
          onValueChange={(value) => setFilters({ operation: value, page: 1 })}
        >
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue placeholder={t("operationLabels", { ns: "fees" })} />
            </SelectTrigger>
            {operation !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ operation: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <SelectContent className="md:w-48">
            {operations?.map((operation) => (
              <SelectItem key={operation.value} value={operation.value}>
                {operation.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type ?? ""} onValueChange={(value) => setFilters({ type: value, page: 1 })}>
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue placeholder={t("typeLabels", { ns: "fees" })} />
            </SelectTrigger>
            {type !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ type: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <SelectContent className="md:w-48">
            {fees?.map((fee) => (
              <SelectItem key={fee.value} value={fee.value}>
                {fee.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currencyId ?? ""}
          onValueChange={(value) => setFilters({ currencyId: value || undefined, page: 1 })}
        >
          <div className="relative w-full md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue
                placeholder={t("depositsTable.filters.currencyPlaceholder", { ns: "transactions" })}
              />
            </SelectTrigger>
            {currencyId !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ currencyId: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <SelectContent className="md:w-52">
            {isLoadingCurrencies ? (
              <div className="p-2 flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              currencies?.map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("network." + currency.network)}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
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
                  {t("table.noResults", { ns: "clients" })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-2 space-y-2 md:space-y-0 py-4">
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
                {t("table.previous", { ns: "clients" })}
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
                {t("table.next", { ns: "clients" })}
              </Button>
            </div>
          </>
        )}
      </div>
      <ConfirmModal
        title={t("feesDelete.title", { ns: "fees" })}
        open={!!enableFeeId}
        onConfirm={async () => {
          await deleteFeeQuery.mutateAsync(enableFeeId as string);
          toast.success(t("feesDelete.success", { ns: "fees" }));
          setEnableFeeId(undefined);
        }}
        onCancel={() => setEnableFeeId(undefined)}
        loading={deleteFeeQuery.isPending}
      >
        <div className="text-sm text-muted-foreground">
          {t("feesDelete.description", { ns: "fees" })}
        </div>
      </ConfirmModal>
    </div>
  );
}
