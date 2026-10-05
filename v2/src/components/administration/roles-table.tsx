"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { DeleteRoleDialog, EditRoleDialog } from "@/components/administration/role-dialogs";
import { useAllRoles } from "@/lib/administration/hooks";
import type { Role } from "@/lib/administration/roles";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function RolesTable() {
  const { data, isLoading, isError } = useAllRoles();
  const { t } = useDictionary();
  const ta = t.adminActions;
  const [editing, setEditing] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);
  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      { accessorKey: "name", header: t.administration.roles.columnLabel },
      {
        id: "permissions",
        header: ta.columnPermissions,
        cell: ({ row }) => {
          // Old single-word codes come back too; only the module.action ones are meaningful here.
          const count = (row.original.permissions ?? []).filter((permission) => permission.module).length;
          return (
            <Badge variant="secondary" title={(row.original.permissions ?? []).filter((p) => p.module).map((p) => p.name).join(", ")}>
              {ta.permissionsCount.replace("{count}", String(count))}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Can permission="role.update">
              <Button variant="ghost" size="icon" aria-label={ta.edit} className="rounded-full" onClick={() => setEditing(row.original)}>
                <Pencil />
              </Button>
            </Can>
            <Can permission="role.delete">
              <Button
                variant="ghost"
                size="icon"
                aria-label={ta.delete}
                className="rounded-full text-destructive"
                onClick={() => setDeleting(row.original)}
              >
                <Trash />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [t, ta],
  );

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
                {t.administration.roles.notFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EditRoleDialog role={editing} onOpenChange={(open) => !open && setEditing(null)} />
      <DeleteRoleDialog role={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </div>
  );
}
