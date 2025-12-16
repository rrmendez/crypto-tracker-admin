/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useWallets } from "@/hooks/use-wallets";
import { Transaction } from "@/types";
import { fDateTime } from "@/utils/format-time";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, ReceiptText } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TransactionDetailDialog } from "./dialogs/transaction-detail-dialog";
import { useBoolean } from "@/hooks/use-boolean";
import { useTranslate } from "@/locales";

import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
import {
  Button as ButtonCalendar,
  DateRangePicker as DateRangePickerCalendar,
  Dialog as DialogCalendar,
  Group as GroupCalendar,
  Popover as PopoverCalendar,
} from "react-aria-components";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import { X, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarDate } from "@internationalized/date";
import { useTableFilters } from "@/hooks/use-table-filters";

type RangeValue<T> = {
  start: T;
  end: T;
};

export default function WalletsTableHistoryOperations() {
  const { t } = useTranslate("history");
  const walletId = useParams().walletId;
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const openDetails = useBoolean();

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
    dateRange: RangeValue<CalendarDate> | null;
  } = {
    page: 1,
    limit: 10,
    dateRange: null,
  };

  const { filters, setFilters } = useTableFilters(
    "wallets-table-history-operations",
    defaultFilters,
    "/transactions/deposits"
  );

  const { page, limit, dateRange } = filters;

  const { getWalletHistoryQuery } = useWallets();

  const apiDateParams = useMemo(() => {
    const startDate = dateRange?.start ? createDateFromCalendarObject(dateRange.start) : undefined;
    const endDate = dateRange?.end ? createDateFromCalendarObject(dateRange.end) : undefined;

    const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)).toISOString() : undefined;
    const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : undefined;

    return { from, to };
  }, [dateRange]);

  const { data, isFetching } = getWalletHistoryQuery({
    page,
    limit,
    walletId: walletId as string,
    ...apiDateParams,
  });

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "type",
      header: t("columns.operation", { ns: "history" }),
      cell: ({ row }) => (
        <span>{t(`operations.type.${row.original.type}`, { ns: "history" })}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("columns.date", { ns: "history" }),
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="flex items-center gap-2">
            <span>{fDateTime(transaction.createdAt)}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "amount",
      header: t("columns.amount", { ns: "history" }),
    },
    {
      accessorKey: "status",
      header: t("columns.status", { ns: "history" }),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex items-center gap-2">
            <span>{t(`operations.status.${transaction.status}`, { ns: "history" })}</span>
          </div>
        );
      },
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
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    openDetails.onTrue();
                  }}
                >
                  <ReceiptText />
                  {t("details", { ns: "history" })}
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

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
          <DateRangePickerCalendar
            className="*:not-first:mt-2 min-w-sm"
            value={dateRange}
            onChange={(e) => setFilters({ dateRange: e })}
          >
            <div className="flex">
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
                    onClick={() => setFilters({ dateRange: null })}
                    aria-label="Clear date filter"
                  >
                    <X size={16} />
                  </button>
                )}
                <ButtonCalendar
                  className={cn(
                    "text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50",
                    "flex w-9 items-center justify-center transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]",
                    dateRange?.start ? "rounded-e-md" : "rounded-e-md"
                  )}
                >
                  <CalendarIcon size={16} />
                </ButtonCalendar>
              </div>
            </div>

            <PopoverCalendar className="z-50 bg-background text-popover-foreground rounded-md border shadow-lg p-2">
              <DialogCalendar>
                <RangeCalendar />
              </DialogCalendar>
            </PopoverCalendar>
          </DateRangePickerCalendar>
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
                    {t("withoutResults", { ns: "history" })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-2 space-y-2 md:space-y-0 py-4">
          {!!data && (
            <div className="text-muted-foreground text-sm text-center md:text-left flex-1">
              {t("page", { ns: "history" })} {data.page} {t("of", { ns: "history" })}{" "}
              {Math.ceil(data.total / limit)}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            <span className="font-semibold text-sm hidden md:inline">
              {t("rowsPerPage", { ns: "history" })}:
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {limit} <ChevronDown className="ml-1 h-4 w-4" />
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
              {t("previous", { ns: "history" })}
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
              {t("next", { ns: "history" })}
            </Button>
          </div>
        </div>
      </div>
      {selectedTransaction && (
        <TransactionDetailDialog
          transaction={selectedTransaction}
          open={openDetails.value}
          onClose={openDetails.onFalse}
        />
      )}
    </>
  );
}
