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
import { useAllSubsidiaries } from "@/lib/administration/hooks";
import type { Subsidiary } from "@/lib/administration/subsidiaries";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function SubsidiariesTable() {
  const { data, isLoading, isError } = useAllSubsidiaries();
  const { t } = useDictionary();
  const ts = t.administration.subsidiaries;
  const columns = useMemo<ColumnDef<Subsidiary>[]>(
    () => [
      { accessorKey: "name", header: ts.columnName },
      { accessorKey: "country", header: ts.columnCountry },
      { accessorKey: "address", header: ts.columnAddress },
    ],
    [ts],
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
                {ts.notFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
