import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSecurity } from "@/hooks/use-security";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useTranslate } from "@/locales";
import { UserSecurityLogVm } from "@/types";
import { fDateTime } from "@/utils/format-time";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown, ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";

type SecurityLogsTableProps = {
  id?: string;
};

export default function SecurityLogsTable({ id }: SecurityLogsTableProps) {
  const [open, setOpen] = useState(false);

  const { t } = useTranslate(["commons", "errors", "clients"]);

  const defaultFilters: {
    page: number;
    limit: number;
    date: Date | undefined;
  } = {
    page: 1,
    limit: 10,
    date: undefined,
  };

  const { filters, setFilters } = useTableFilters(
    "security-logs-table",
    defaultFilters,
    "/transactions/deposits"
  );

  const { page, limit, date } = filters;

  const { getSecurityLogsClients } = useSecurity();

  const { data, isFetching } = getSecurityLogsClients(id as string, {
    page,
    limit,
    createdAt: date?.toISOString(),
    orderBy: "createdAt",
    order: "DESC",
  });

  const columns: ColumnDef<UserSecurityLogVm>[] = [
    {
      accessorKey: "createdAt",
      header: t("securityTab.table.createdAt", { ns: "clients" }),
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex items-center gap-2">
            <span>{fDateTime(client.createdAt)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdBy",
      header: t("securityTab.table.createdBy", { ns: "clients" }),
      cell: ({ row }) => {
        const client = row.original;
        const { email } = client.createdBy;

        return (
          <div className="flex items-center gap-3">
            <span className="text-sm ">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "actionType",
      header: t("securityTab.table.actionType", { ns: "clients" }),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <span className="text-sm ">
              {t(`transactions.actionType.${row.original.actionType}`, { ns: "commons" })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: t("securityTab.table.reason", { ns: "clients" }),
      cell: ({ row }) => {
        const reason = row.original.reason;

        return (
          <div className="text-sm max-w-xl whitespace-pre-wrap break-words line-clamp-2">
            {reason}
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date" className="md:w-48 justify-between font-normal">
              {date ? date.toLocaleDateString() : "Select date"}
              <div className="flex items-center">
                {!!date && (
                  <span
                    className="text-muted-foreground mr-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilters({ date: undefined, page: 1 });
                    }}
                  >
                    <X />
                  </span>
                )}
                <ChevronDownIcon />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setFilters({ date, page: 1 });
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
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
      </div>
    </div>
  );
}
