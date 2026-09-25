"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash } from "lucide-react";
import { useAllUsers } from "@/lib/administration/hooks";
import type { User } from "@/lib/administration/users";
import { DeleteUserDialog } from "@/components/administration/delete-user-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionary";

function getColumns(t: Dictionary): ColumnDef<User>[] {
  return [
    { accessorKey: "username", header: t.administration.users.columnUsername },
    { accessorKey: "lastname", header: t.administration.users.columnLastname },
    { accessorKey: "firstname", header: t.administration.users.columnFirstname },
    {
      accessorKey: "email",
      header: t.administration.users.columnEmail,
      cell: ({ row }) => (
        <Button
          variant="link"
          className="h-auto p-0"
          nativeButton={false}
          render={
            <a
              href={`mailto:${row.original.email}`}
              target="_blank"
              rel="noreferrer noopener"
            />
          }
        >
          {row.original.email}
        </Button>
      ),
    },
    {
      id: "roles",
      header: t.administration.users.columnRole,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          {row.original.roles?.map((role) => (
            <Badge key={role.id} variant="secondary">
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "subsidiary",
      header: t.administration.users.columnSubsidiary,
      cell: ({ row }) => row.original.subsidiary?.name,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-end">
          <DeleteUserDialog userId={row.original.id!}>
            <Button variant="ghost" size="icon" className="rounded-full text-destructive">
              <Trash />
            </Button>
          </DeleteUserDialog>
        </div>
      ),
    },
  ];
}

export function UsersTable() {
  const { data, isLoading, isError } = useAllUsers();
  const { t } = useDictionary();
  const columns = useMemo(() => getColumns(t), [t]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-5">
      <Table className="border">
        <TableHeader>
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
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {isError && !isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-destructive">
                {t.common.loadError}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            !isError &&
            table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id} className={index % 2 === 0 ? "bg-card" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && !isError && data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {t.administration.users.notFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
