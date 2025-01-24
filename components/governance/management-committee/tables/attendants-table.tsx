"use client";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ListTodo, Pencil, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllMeetingAttendants } from "@/services/api-sdk/models/management-committee";
import AllAttendantsCheckbox from "@/components/governance/management-committee/buttons/all-attendants-checkbox";
import AttendantCheckbox from "@/components/governance/management-committee/buttons/attendant-checkbox";
import DeleteAttendantButton from "@/components/governance/management-committee/buttons/delete-attendant-button";
import {
  UpdateAttendantDialog,
  UpdateAttendantDialogErrorBoundary,
} from "@/components/governance/management-committee/modals/update-attendant-dialog";
import AddAttendantDialog from "@/components/governance/management-committee/modals/add-attendant-dialog";
import { FormattedMessage, useIntl } from "react-intl";
export const getColumns = (meetingId) => [
  {
    id: "select",
    header: ({ table }) => (
      <AllAttendantsCheckbox meetingId={meetingId} table={table} />
    ),
    cell: ({ row }) => <AttendantCheckbox meetingId={meetingId} row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <FormattedMessage id="managementCommittee.fullNameHeader" />,
  },
  {
    id: "quality",
    header: () => <FormattedMessage id="managementCommittee.qualityHeader" />,
    cell: ({ row }) =>
      row.original.type === "director" ? "Directeur" : row.original.grade,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      row.original.type === "not_director" && (
        <div className="flex items-center">
          <Tooltip>
            <UpdateAttendantDialogErrorBoundary>
              <UpdateAttendantDialog asChild attendantId={row.original.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-accent"
                  >
                    <Pencil size={16} />
                  </Button>
                </TooltipTrigger>
              </UpdateAttendantDialog>
            </UpdateAttendantDialogErrorBoundary>
            <TooltipContent>
              <FormattedMessage id="managementCommittee.editButton" />
            </TooltipContent>
          </Tooltip>

          <DeleteAttendantButton attendantId={row.original.id} />
        </div>
      ),
    enableSorting: false,
    enableHiding: false,
  },
];
export default function AttendantsTable({
  meetingId,
  containerClassName,
  tableWrapperClassName,
}: {
  meetingId: string;
  containerClassName?: string;
  tableWrapperClassName: string;
}) {
  const intl = useIntl();
  const { data, isLoading, isError } = useAllMeetingAttendants(meetingId);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const columns = useMemo(() => getColumns(meetingId), [meetingId]);
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
      rowSelection,
    },
  });
  if (isError) {
    throw Error("Failed to fetch attendants");
  }
  if (isLoading) {
    return (
      <div>
        <FormattedMessage id="managementCommittee.loadingText" />
      </div>
    );
  }
  return (
    <div className={cn("space-y-5 overflow-auto", containerClassName)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            placeholder={intl.formatMessage({
              id: "managementCommittee.searchPlaceholder",
            })}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm pl-10 focus-visible:ring-0"
          />
          <Search className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
        </div>
        <AddAttendantDialog asChild meetingId={meetingId}>
          <Button aria-label="Ajouter une tâche" className="gap-2">
            <ListTodo />
            <span className="sr-only sm:not-sr-only">
              <FormattedMessage id="managementCommittee.addButton" />
            </span>
          </Button>
        </AddAttendantDialog>
      </div>
      <div className={tableWrapperClassName}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("group", {
                    "bg-card": index % 2 === 0,
                    "text-gray-500": row.getIsSelected(),
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <FormattedMessage id="managementCommittee.noAttendantsFound" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
