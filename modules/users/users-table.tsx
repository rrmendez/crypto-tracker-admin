"use client";

import { ConfirmModal } from "@/components/custom/modals";
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
import { useTableFilters } from "@/hooks/use-table-filters";
import { useUsers } from "@/hooks/use-users";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import { UsersResponseVm } from "@/types";
import { fDate, fTime } from "@/utils/format-time";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Ban,
  BookUser,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Link,
  Mail,
  MoreHorizontal,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export function UsersTable() {
  const { t } = useTranslate(["users", "clients"]);

  const [selectedUser, setSelectedUser] = useState<UsersResponseVm>();

  const defaultFilters: {
    page: number;
    limit: number;
    email: string;
    status: string | undefined;
  } = {
    page: 1,
    limit: 10,
    email: "",
    status: undefined,
  };

  const { filters, setFilters, navigateWithSavedFilters } = useTableFilters(
    "user-table",
    defaultFilters,
    "/users"
  );

  const { page, limit, email, status } = filters;

  const { getUsersQuery, resendEmail, deactivateUserQry, activateUserQry } = useUsers();
  const { data, isFetching } = getUsersQuery({
    page,
    limit,
    orderBy: "createdAt",
    order: "DESC",
    composerSearch: email,
    verified: !status || status === "all" ? undefined : status === "CONFIRMED",
  });

  const columns: ColumnDef<UsersResponseVm>[] = [
    {
      accessorKey: "email",
      header: t("table.information", { ns: "clients" }),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="font-medium">{user.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: " ",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="font-medium">{fDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-muted-foreground">{fTime(user.createdAt)}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "state",
      header: " ",
      cell: ({ row }) => {
        const user = row.original;
        /**FIXME: Campo del backend para verificar el status de mi usuario */
        return (
          <div className="flex flex-col">
            <div
              className={cn(
                "flex items-center gap-2",
                { "text-destructive": user.isBlocked },
                { "text-primary": !user.isBlocked }
              )}
            >
              {user.isBlocked ? <Ban size={16} /> : <CheckCircle size={16} />}
              {user.isBlocked
                ? t("table.blocked", { ns: "clients" })
                : t("table.verified", { ns: "clients" })}
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                { "text-destructive": !user.verified },
                { "text-primary": user.verified }
              )}
            >
              {!user.verified ? <Ban size={16} /> : <CheckCircle size={16} />}
              {user.verified
                ? t("table.status.confirmed", { ns: "users" })
                : t("table.status.pending", { ns: "users" })}
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
                    navigateWithSavedFilters("user-table", filters, paths.users.edit(client.id))
                  }
                >
                  <BookUser />
                  {t("table.edit", { ns: "users" })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigateWithSavedFilters("user-table", filters, paths.users.details(client.id))
                  }
                >
                  <BookUser />
                  {t("table.details", { ns: "users" })}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedUser(client)}>
                  <BookUser />
                  {client.isBlocked
                    ? t("table.activate", { ns: "users" })
                    : t("table.deactivate", { ns: "users" })}
                </DropdownMenuItem>

                {!client.verified && (
                  <DropdownMenuItem
                    onClick={async () => {
                      await resendEmail.mutateAsync(client.id);
                    }}
                  >
                    <Link />
                    Reenviar link
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

  const handleChangeEmail = useDebouncedCallback((search: string) => {
    setFilters({ email: search, page: 1 });
  }, 1000);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center py-4 gap-2 md:space-x-4">
        <Input
          placeholder={t("table.placeholderEmail", { ns: "users" })}
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
              <SelectValue placeholder={t("table.placeholderStatus", { ns: "users" })} />
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
            <SelectItem value="all">{t("table.status.all", { ns: "users" })}</SelectItem>
            <SelectItem value="PENDING">{t("table.status.pending", { ns: "users" })}</SelectItem>
            <SelectItem value="CONFIRMED">
              {t("table.status.confirmed", { ns: "users" })}
            </SelectItem>
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
        title={t("messages.titleModal", { ns: "users" })}
        open={!!selectedUser}
        onConfirm={async () => {
          if (selectedUser) {
            if (selectedUser.isBlocked) {
              await activateUserQry.mutateAsync(selectedUser.id);
            } else {
              await deactivateUserQry.mutateAsync(selectedUser.id);
            }
            setSelectedUser(undefined);
          }
        }}
        onCancel={() => setSelectedUser(undefined)}
        loading={activateUserQry.isPending || deactivateUserQry.isPending}
      >
        <div className="text-sm text-muted-foreground">
          {selectedUser?.isBlocked
            ? t("messages.descriptionActive", { ns: "users" })
            : t("messages.descriptionDeactivate", { ns: "users" })}
        </div>
      </ConfirmModal>
    </div>
  );
}
