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
import { Skeleton } from "@/components/ui/skeleton";
import { useAllRoles } from "@/lib/administration/hooks";
import type { Role } from "@/lib/administration/roles";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function RolesTable() {
  const { data, isLoading, isError } = useAllRoles();
  const { t } = useDictionary();
  const columns = useMemo<ColumnDef<Role>[]>(
    () => [{ accessorKey: "name", header: t.administration.roles.columnLabel }],
    [t],
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
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {isError && !isLoading && (
            <TableRow>
              <TableCell className="text-center text-destructive">
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
              <TableCell className="text-center">
                {t.administration.roles.notFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
