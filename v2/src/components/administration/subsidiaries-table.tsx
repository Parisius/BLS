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
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { DeleteSubsidiaryDialog, EditSubsidiaryDialog } from "@/components/administration/subsidiary-dialogs";
import { useAllSubsidiaries } from "@/lib/administration/hooks";
import type { Subsidiary } from "@/lib/administration/subsidiaries";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function SubsidiariesTable() {
  const { data, isLoading, isError } = useAllSubsidiaries();
  const { t } = useDictionary();
  const ts = t.administration.subsidiaries;
  const ta = t.adminActions;
  const [editing, setEditing] = useState<Subsidiary | null>(null);
  const [deleting, setDeleting] = useState<Subsidiary | null>(null);
  const columns = useMemo<ColumnDef<Subsidiary>[]>(
    () => [
      { accessorKey: "name", header: ts.columnName },
      { accessorKey: "country", header: ts.columnCountry },
      { accessorKey: "address", header: ts.columnAddress },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Can permission="subsidiary.update">
              <Button variant="ghost" size="icon" aria-label={ta.edit} className="rounded-full" onClick={() => setEditing(row.original)}>
                <Pencil />
              </Button>
            </Can>
            <Can permission="subsidiary.delete">
              <Button variant="ghost" size="icon" aria-label={ta.delete} className="rounded-full text-destructive" onClick={() => setDeleting(row.original)}>
                <Trash />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [ts, ta],
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
      <EditSubsidiaryDialog subsidiary={editing} onOpenChange={(open) => !open && setEditing(null)} />
      <DeleteSubsidiaryDialog subsidiary={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </div>
  );
}
