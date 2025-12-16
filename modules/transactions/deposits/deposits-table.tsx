/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslate } from "@/locales";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrencies } from "@/hooks/use-currencies";
import { useWallets } from "@/hooks/use-wallets";
import { paths } from "@/routes/paths";
import { Transaction } from "@/types";
import { fDateTime } from "@/utils/format-time";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Ban,
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  Loader2,
  MoreHorizontal,
  ReceiptText,
  X,
} from "lucide-react";
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
import { cn } from "@/lib/utils";
import {
  Button as ButtonCalendar,
  DateRangePicker as DateRangePickerCalendar,
  Dialog as DialogCalendar,
  Group as GroupCalendar,
  Popover as PopoverCalendar,
} from "react-aria-components";
import { RangeCalendar } from "@/components/ui/calendar-rac";

import { CalendarDate } from "@internationalized/date";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useMemo } from "react";

type RangeValue<T> = {
  start: T;
  end: T;
};

export function DepositsTable() {
  const { t } = useTranslate("transactions");

  const { getWalletHistoryQuery } = useWallets();

  const createDateFromCalendarObject = (calendarObject: any): Date | undefined => {
    if (calendarObject) {
      return new Date(calendarObject.year, calendarObject.month - 1, calendarObject.day);
    }
    if (calendarObject && typeof calendarObject === "object" && calendarObject.year) {
      return new Date(calendarObject.year, calendarObject.month - 1, calendarObject.day);
    }
    return undefined;
  };

  const defaultFilters: {
    page: number;
    limit: number;
    username: string;
    currencyCode: string | undefined;
    status: string | undefined;
    dateRange: RangeValue<CalendarDate> | null;
  } = {
    page: 1,
    limit: 10,
    username: "",
    currencyCode: undefined,
    status: undefined,
    dateRange: null,
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "deposits-table",
    defaultFilters,
    "/transactions/deposits"
  );

  const { page, limit, username, currencyCode, status, dateRange } = filters;

  const apiDateParams = useMemo(() => {
    const startDate = dateRange?.start ? createDateFromCalendarObject(dateRange.start) : undefined;
    const endDate = dateRange?.end ? createDateFromCalendarObject(dateRange.end) : undefined;

    const createdAtFrom = startDate
      ? new Date(startDate.setHours(0, 0, 0, 0)).toISOString()
      : undefined;
    const createdAtTo = endDate
      ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString()
      : undefined;

    return { createdAtFrom, createdAtTo };
  }, [dateRange]);

  const { getCurrenciesSystem } = useCurrencies();
  const { data: currencies, isLoading: isLoadingCurrencies } = getCurrenciesSystem();

  const { data, isFetching } = getWalletHistoryQuery({
    page,
    limit,
    types: "DEPOSIT",
    username,
    currencyCode,
    status,
    orderBy: "createdAt",
    order: "DESC",
    ...apiDateParams,
  });

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "user",
      header: t("depositsTable.headers.user", { ns: "transactions" }),
      cell: ({ row }) => <span>{row.original.user.email}</span>,
    },
    {
      accessorKey: "type",
      header: t("depositsTable.headers.operation", { ns: "transactions" }),
      cell: ({ row }) => <span>{t(`operations.type.${row.original.type}`)}</span>,
    },
    {
      accessorKey: "amount",
      header: t("depositsTable.headers.amount", { ns: "transactions" }),
    },
    {
      accessorKey: "currencyCode",
      header: t("depositsTable.headers.currency", { ns: "transactions" }),
    },
    {
      accessorKey: "createdAt",
      header: t("depositsTable.headers.createdAt", { ns: "transactions" }),
      cell: ({ row }) => <span>{fDateTime(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: t("depositsTable.headers.updatedAt", { ns: "transactions" }),
      cell: ({ row }) => <span>{fDateTime(row.original.updatedAt)}</span>,
    },
    {
      accessorKey: "status",
      header: t("depositsTable.headers.status", { ns: "transactions" }),
      cell: ({ row }) => (
        <div
          className={cn("flex items-center gap-2", {
            "text-destructive": row.original.status === "FAILED",
            "text-amber-500": row.original.status === "PENDING",
            "text-primary": row.original.status === "CONFIRMED",
          })}
        >
          {row.original.status === "CONFIRMED" ? <CheckCircle size={16} /> : <Ban size={16} />}
          <span>{t(`operations.status.${row.original.status}`, { ns: "transactions" })}</span>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="flex justify-end md:pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    navigateWithSavedFilters(
                      "deposits-table",
                      filters,
                      paths.transactions.deposits.details(transaction.id)
                    )
                  }
                >
                  <ReceiptText />
                  {t("depositsTable.actions.details", { ns: "transactions" })}
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

  const handleChangeUsername = useDebouncedCallback((search: string) => {
    setFilters({ username: search, page: 1 });
  }, 1000);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:gap-0 md:space-x-4">
        <Input
          placeholder={t("depositsTable.filters.userPlaceholder", { ns: "transactions" })}
          className="w-full md:max-w-sm"
          defaultValue={username}
          onChange={(e) => handleChangeUsername(e.target.value)}
        />

        <DateRangePickerCalendar
          className="w-full md:max-w-sm"
          value={dateRange}
          onChange={(e) => setFilters({ dateRange: e, page: 1 })}
        >
          <div className="flex w-full">
            <GroupCalendar
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                dateInputStyle
              )}
            >
              <DateInput slot="start" unstyled />
              <span aria-hidden="true" className="text-muted-foreground/70 px-2">
                -
              </span>
              <DateInput slot="end" unstyled />
            </GroupCalendar>

            <div className="flex -ms-[70px] z-20">
              {dateRange?.start && (
                <button
                  type="button"
                  className="text-muted-foreground/80 hover:text-foreground flex w-9 items-center justify-center transition-colors outline-none"
                  onClick={() => setFilters({ dateRange: null, page: 1 })}
                  aria-label="Borrar filtro de fecha"
                  title="Borrar filtro de fecha"
                >
                  <X size={16} />
                </button>
              )}

              <ButtonCalendar
                className={cn(
                  "text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50",
                  "flex w-9 items-center justify-center transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]",
                  "rounded-e-md"
                )}
              >
                <CalendarIcon size={16} />
              </ButtonCalendar>
            </div>
          </div>
          <PopoverCalendar
            className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden"
            offset={4}
          >
            <DialogCalendar className="max-h-[inherit] overflow-auto p-2">
              <RangeCalendar />
            </DialogCalendar>
          </PopoverCalendar>
        </DateRangePickerCalendar>

        <Select
          value={currencyCode ?? ""}
          onValueChange={(value) => setFilters({ currencyCode: value || undefined, page: 1 })}
        >
          <div className="relative w-full md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue
                placeholder={t("depositsTable.filters.currencyPlaceholder", { ns: "transactions" })}
              />
            </SelectTrigger>
            {currencyCode !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ currencyCode: undefined, page: 1 })}
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
                <SelectItem key={currency.id} value={currency.code}>
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">{currency.name}</span>
                    <span className="text-xs text-muted-foreground">({currency.code})</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select
          value={status ?? ""}
          onValueChange={(value) => setFilters({ status: value || undefined, page: 1 })}
        >
          <div className="relative w-full md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue
                placeholder={t("depositsTable.filters.statusPlaceholder", { ns: "transactions" })}
              />
            </SelectTrigger>
            {status !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ status: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <SelectContent className="md:w-52">
            <SelectItem value="all">
              {t("depositsTable.filters.status.all", { ns: "transactions" })}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("depositsTable.filters.status.pending", { ns: "transactions" })}
            </SelectItem>
            <SelectItem value="CONFIRMED">
              {t("depositsTable.filters.status.confirmed", { ns: "transactions" })}
            </SelectItem>
            <SelectItem value="FAILED">
              {t("depositsTable.filters.status.failed", { ns: "transactions" })}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              <Skeleton className="h-5 w-52" />
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
    </div>
  );
}
