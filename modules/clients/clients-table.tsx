"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Ban,
  BookUser,
  CalendarClock,
  CheckCircle,
  ChevronDown,
  ChevronDownIcon,
  IdCard,
  Loader2,
  MoreHorizontal,
  Store,
  UserRound,
  WalletMinimal,
  X,
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
import { UsersResponseVm } from "@/types";
import { useClients } from "@/hooks/use-clients";
import { fDateTime } from "@/utils/format-time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "@/routes/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { paths } from "@/routes/paths";
import { fDocument } from "@/utils/format-number";
import flags from "react-phone-number-input/flags";
import * as RPNInput from "react-phone-number-input";
import { useTranslate } from "@/locales";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

const countryNames: Record<string, string> = {
  BR: "Brasil",
  AR: "Argentina",
  CL: "Chile",
  MX: "México",
  US: "Estados Unidos",
  CO: "Colombia",
  PE: "Perú",
  ES: "España",
};

// ---------------------------------------------------------------------------

export function ClientsTable() {
  const { t } = useTranslate(["clients", "transactions", "compliance"]);

  const defaultFilters: {
    page: number;
    limit: number;
    composerSearch: string;
    createdAt: Date | undefined;
    roles: string | undefined;
    complianceKycStatus: string | undefined;

    // TODO: Agregar filtros adicionales
    withdrawStatus: string | undefined;
    accountStatus: string | undefined;
  } = {
    page: 1,
    limit: 10,
    composerSearch: "",
    createdAt: undefined,
    roles: undefined,
    complianceKycStatus: undefined,
    withdrawStatus: undefined,
    accountStatus: undefined,
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "clients-table",
    defaultFilters,
    "/clients"
  );

  const {
    page,
    limit,
    composerSearch,
    createdAt,
    roles,
    complianceKycStatus,
    withdrawStatus,
    accountStatus,
  } = filters;
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { getClients, createWalletsList } = useClients();

  const { data, isFetching } = getClients({
    page,
    limit,
    createdAt: createdAt?.toISOString(),
    composerSearch,
    roles,
    complianceKycStatus,
  });

  const columns: ColumnDef<UsersResponseVm>[] = [
    {
      accessorKey: "fullName",
      header: t("table.information", { ns: "clients" }),
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarImage src={client.avatar} alt={client.fullName} />
              <AvatarFallback className="bg-primary/30 text-primary font-semibold uppercase">
                {client.firstName
                  .trim()
                  .split(" ")
                  .reduce((acc, word) => acc + word[0], "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{client.fullName}</span>
              <span className="text-sm text-muted-foreground lowercase">{client.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: " ",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {client.roles.includes("merchant") ? <Store size={16} /> : <UserRound size={16} />}
              {client.roles.includes("merchant")
                ? t("table.merchant", { ns: "clients" })
                : t("table.personal", { ns: "clients" })}
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock size={16} />
              {fDateTime(client.createdAt)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "document",
      header: " ",
      cell: ({ row }) => {
        const client = row.original;
        const countryCode = client.countryCode || "BR";
        const countryName = countryNames[countryCode] || countryCode;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <IdCard size={16} />
              <span>{fDocument(client.document || "")}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <FlagComponent
                country={countryCode as RPNInput.Country}
                countryName={countryName}
                aria-hidden="true"
              />
              <span className="text-sm text-muted-foreground">{countryName}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: " ",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex flex-col">
            <Tooltip>
              <TooltipTrigger
                render={
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      { "text-destructive": client.isBlocked },
                      { "text-primary": !client.isBlocked }
                    )}
                  >
                    {client.isBlocked ? <Ban size={16} /> : <CheckCircle size={16} />}
                    {client.isBlocked
                      ? t("table.blocked", { ns: "clients" })
                      : t("table.verified", { ns: "clients" })}
                  </div>
                }
              ></TooltipTrigger>
              <TooltipPopup>{t("table.tooltip.accountStatus", { ns: "clients" })}</TooltipPopup>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      { "text-destructive": client.withdrawBlocked },
                      { "text-primary": !client.withdrawBlocked }
                    )}
                  >
                    {client.withdrawBlocked ? <Ban size={16} /> : <CheckCircle size={16} />}
                    {client.withdrawBlocked
                      ? t("table.blockedTransactions", { ns: "clients" })
                      : t("table.withdrawOpen", { ns: "clients" })}
                  </div>
                }
              ></TooltipTrigger>
              <TooltipPopup>
                {t("table.tooltip.transactionsStatus", { ns: "clients" })}
              </TooltipPopup>
            </Tooltip>
          </div>
        );
      },
    },
    {
      accessorKey: "complianceKycStatus",
      header: " ",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {client.complianceKycStatus &&
                t(`complianceTable.statusType.${client.complianceKycStatus}`, {
                  ns: "compliance",
                })}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const client = row.original;

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
                      "clients-table",
                      filters,
                      paths.clients.details(client.id)
                    )
                  }
                >
                  <BookUser />
                  {t("table.profile", { ns: "clients" })}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(paths.clients.walletsLis(client.id))}>
                  <BookUser />
                  {t("table.wallets", { ns: "clients" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`${paths.clients.config(client.id)}/?verified=${client.verified}`)
                  }
                >
                  <BookUser />
                  {t("table.config", { ns: "clients" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => createWalletsList.mutateAsync(client.id)}
                  disabled={createWalletsList.isPending}
                >
                  {createWalletsList.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <WalletMinimal />
                  )}
                  {t("table.createWallets", { ns: "clients" })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];
    return (
      <span className="w-5 overflow-hidden rounded-sm">{Flag && <Flag title={countryName} />}</span>
    );
  };

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.page ?? 1,
  });

  const colCount = columns.length;
  const skeletonRows = Array.from({ length: 10 });

  const handleChangeSearch = useDebouncedCallback((search: string) => {
    setFilters({ composerSearch: search, page: 1 });
  }, 1000);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
        <Input
          placeholder={t("depositsTable.filters.userPlaceholder", { ns: "transactions" })}
          className="max-w-xs"
          defaultValue={composerSearch}
          onChange={(e) => handleChangeSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setFilters({ composerSearch: (e.target as HTMLInputElement).value, page: 1 });
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="md:w-48 justify-between font-normal">
              {createdAt
                ? createdAt.toLocaleDateString()
                : t("depositsTable.filters.datePlaceholder", { ns: "transactions" })}
              <div className="flex items-center">
                {!!createdAt && (
                  <span
                    className="text-muted-foreground mr-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilters({ createdAt: undefined, page: 1 });
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
              selected={createdAt}
              captionLayout="dropdown"
              onSelect={(date) => {
                setFilters({ createdAt: date, page: 1 });
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <Select
          value={roles ?? ""}
          onValueChange={(value) => setFilters({ roles: value || undefined, page: 1 })}
        >
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue
                placeholder={t("depositsTable.filters.rolesPlaceholder", { ns: "transactions" })}
              />
            </SelectTrigger>

            {roles !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ roles: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <SelectContent className="md:w-48">
            <SelectItem value="user">
              {t("depositsTable.filters.roles.user", { ns: "transactions" })}
            </SelectItem>
            <SelectItem value="merchant">
              {t("depositsTable.filters.roles.merchant", { ns: "transactions" })}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={withdrawStatus ?? ""}
          onValueChange={(value) => setFilters({ withdrawStatus: value || undefined, page: 1 })}
        >
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue placeholder={t("clientsTable.transfer", { ns: "clients" })} />
            </SelectTrigger>

            {withdrawStatus !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ withdrawStatus: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <SelectContent className="md:w-48">
            <SelectItem value="user">{t("clientsTable.rejected", { ns: "clients" })}</SelectItem>
            <SelectItem value="merchant">{t("clientsTable.active", { ns: "clients" })}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={complianceKycStatus ?? ""}
          onValueChange={(value) =>
            setFilters({ complianceKycStatus: value || undefined, page: 1 })
          }
        >
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue placeholder={t("clientsTable.kycStatus", { ns: "clients" })} />
            </SelectTrigger>

            {complianceKycStatus !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ complianceKycStatus: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <SelectContent className="md:w-48">
            <SelectItem value="REQUESTED">
              {t("clientsTable.kyc.requested", { ns: "clients" })}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("clientsTable.kyc.pending", { ns: "clients" })}
            </SelectItem>
            <SelectItem value="APPROVED">
              {t("clientsTable.kyc.approved", { ns: "clients" })}
            </SelectItem>
            <SelectItem value="REJECTED">
              {t("clientsTable.kyc.rejected", { ns: "clients" })}
            </SelectItem>
            <SelectItem value="PARTIALLY_REJECTED">
              {t("clientsTable.kyc.rejectedParcially", { ns: "clients" })}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={accountStatus ?? ""}
          onValueChange={(value) => setFilters({ accountStatus: value || undefined, page: 1 })}
        >
          <div className="relative md:w-52">
            <SelectTrigger className="w-full pr-10">
              <SelectValue placeholder={t("clientsTable.accountStatus", { ns: "clients" })} />
            </SelectTrigger>

            {accountStatus !== undefined && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setFilters({ accountStatus: undefined, page: 1 })}
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <SelectContent className="md:w-48">
            <SelectItem value="REQUESTED">
              {t("clientsTable.notVerified", { ns: "clients" })}
            </SelectItem>
            <SelectItem value="PENDING">{t("clientsTable.verified", { ns: "clients" })}</SelectItem>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
