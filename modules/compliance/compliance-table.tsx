/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useKycs } from "@/hooks/use-kycs";
import { useTableFilters } from "@/hooks/use-table-filters";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import { KYCResponseVm } from "@/types";
import { fDateTime } from "@/utils/format-time";
import { CalendarDate } from "@internationalized/date";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { CalendarIcon, ChevronDown, MoreHorizontal, ReceiptText, X } from "lucide-react";
import { useMemo } from "react";
import {
  DateRangePicker,
  Group,
  Button as ButtonCalendar,
  Popover as PopoverCalendar,
  Dialog as DialogCalendar,
} from "react-aria-components";

type RangeValue<T> = {
  start: T;
  end: T;
};

export default function ComplianceTable() {
  const { t } = useTranslate(["compliance", "transactions"]);
  const { getKycsListQuery } = useKycs();

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
    email: string;
    status: string | undefined;
    dateRange: RangeValue<CalendarDate> | null;
  } = {
    page: 1,
    limit: 10,
    email: "",
    status: undefined,
    dateRange: null,
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "compliance-table",
    defaultFilters,
    "/compliance"
  );

  const { page, limit, email, status, dateRange } = filters;

  const apiDateParams = useMemo(() => {
    const startDate = dateRange?.start ? createDateFromCalendarObject(dateRange.start) : undefined;
    const endDate = dateRange?.end ? createDateFromCalendarObject(dateRange.end) : undefined;

    const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)).toISOString() : undefined;
    const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : undefined;

    return { from, to };
  }, [dateRange]);

  const { data, isFetching } = getKycsListQuery({
    page,
    limit,
    email,
    status: status === "all" ? undefined : status,
    order: "DESC",
    orderBy: "createdAt",
    ...apiDateParams,
  });

  const columns: ColumnDef<KYCResponseVm>[] = [
    {
      accessorKey: "id",
      header: t("complianceTable.user", { ns: "compliance" }),
      cell: ({ row }) => {
        const kyc = row.original;

        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span>{kyc.user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("complianceTable.createdAt", { ns: "compliance" }),
      cell: ({ row }) => {
        const kyc = row.original;

        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span>{fDateTime(kyc.createdAt)}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("complianceTable.updatedAt", { ns: "compliance" }),
      cell: ({ row }) => {
        const kyc = row.original;

        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span>{fDateTime(kyc.updatedAt)}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedBy",
      header: t("complianceTable.updatedBy", { ns: "compliance" }),
      cell: ({ row }) => {
        const kyc = row.original;

        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span>{kyc.updatedBy}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("complianceTable.status", { ns: "compliance" }),
      cell: ({ row }) => {
        const kyc = row.original;

        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span>{t(`complianceTable.statusType.${kyc.status}`, { ns: "compliance" })}</span>
            </div>
          </div>
        );
      },
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
                <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    navigateWithSavedFilters(
                      "compliance-table",
                      filters,
                      paths.compliance.details(kyc.id)
                    )
                  }
                >
                  <ReceiptText />
                  {t("complianceTable.viewDetails", { ns: "compliance" })}
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

  const handleChangeEmail = useDebouncedCallback((search: string) => {
    setFilters({ email: search, page: 1 });
  }, 1000);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
        <Input
          placeholder={t("complianceListView.placeholderEmail", { ns: "compliance" })}
          className="max-w-sm"
          onChange={(e) => handleChangeEmail(e.target.value)}
          defaultValue={email}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setFilters({ email: (e.target as HTMLInputElement).value, page: 1 });
            }
          }}
        />
        <Select
          value={status ?? ""}
          onValueChange={(value) => setFilters({ status: value || undefined, page: 1 })}
        >
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue
                placeholder={t("complianceListView.placeholderStatus", { ns: "compliance" })}
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

          <SelectContent className="md:w-48">
            <SelectItem value="REQUESTED">
              {t("complianceTable.statusType.REQUESTED", { ns: "compliance" })}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("complianceTable.statusType.PENDING", { ns: "compliance" })}
            </SelectItem>
            <SelectItem value="APPROVED">
              {t("complianceTable.statusType.APPROVED", { ns: "compliance" })}
            </SelectItem>
            <SelectItem value="REJECTED">
              {t("complianceTable.statusType.REJECTED", { ns: "compliance" })}
            </SelectItem>
            <SelectItem value="PARTIALLY_REJECTED">
              {t("complianceTable.statusType.PARTIALLY_REJECTED", { ns: "compliance" })}
            </SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          className="*:not-first:mt-2 min-w-sm"
          value={dateRange}
          onChange={(e) => setFilters({ dateRange: e, page: 1 })}
        >
          <div className="flex">
            <Group
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
            </Group>

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
                  dateRange?.start ? "rounded-e-md" : "rounded-e-md"
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
        </DateRangePicker>
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
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="md:mr-8" size="sm" disabled={isFetching}>
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
