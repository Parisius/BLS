"use client";
import * as React from "react";
import { useState } from "react";
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
import AddProcedureTaskFormDialog from "@/components/governance/administration-meeting/modals/add-procedure-task-form-dialog";
import {
  UpdateProcedureTaskDialog,
  UpdateProcedureTaskDialogErrorBoundary,
} from "@/components/governance/administration-meeting/modals/update-procedure-task-dialog";
import DeleteProcedureTaskButton from "@/components/governance/administration-meeting/buttons/delete-procedure-task-button";
import ProcedureTaskCheckbox from "@/components/governance/administration-meeting/buttons/procedure-task-checkbox";
import ProcedureAllTasksCheckbox from "@/components/governance/administration-meeting/buttons/procedure-all-tasks-checkbox";
import { useAllMeetingProcedureTasks } from "@/services/api-sdk/models/administration-meeting";
import { FormattedMessage, useIntl } from "react-intl";
export const columns = [
  {
    id: "select",
    header: ({ table }) => <ProcedureAllTasksCheckbox table={table} />,
    cell: ({ row }) => <ProcedureTaskCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <FormattedMessage id="sessionAdministrator.task" />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center sm:opacity-0 sm:transition sm:duration-500 sm:group-hover:opacity-100">
        <Tooltip>
          <UpdateProcedureTaskDialogErrorBoundary>
            <UpdateProcedureTaskDialog asChild taskId={row.original.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-accent"
                >
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
            </UpdateProcedureTaskDialog>
          </UpdateProcedureTaskDialogErrorBoundary>
          <TooltipContent>
            <FormattedMessage id="sessionAdministrator.update_attendant_submit_button" />
          </TooltipContent>
        </Tooltip>

        <DeleteProcedureTaskButton taskId={row.original.id} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
export default function ProcedureTable({
  meetingId,
  containerClassName,
  tableWrapperClassName,
}) {
  const intl = useIntl();
  const { data, isLoading, isError } = useAllMeetingProcedureTasks(meetingId);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
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
    throw Error("Failed to fetch procedure tasks");
  }
  if (isLoading) {
    return (
      <div>
        <FormattedMessage id="sessionAdministrator.loading" />
      </div>
    );
  }
  return (
    <div className={cn("space-y-5 overflow-auto", containerClassName)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            placeholder={intl.formatMessage({
              id: "sessionAdministrator.administrators_mandates_table_search_placeholder",
            })}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm pl-10 focus-visible:ring-0"
          />
          <Search className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
        </div>
        <AddProcedureTaskFormDialog asChild meetingId={meetingId}>
          <Button aria-label="Ajouter une tâche" className="gap-2">
            <ListTodo />
            <span className="sr-only sm:not-sr-only">
              <FormattedMessage id="sessionAdministrator.administrators_mandates_table_add_button" />
            </span>
          </Button>
        </AddProcedureTaskFormDialog>
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
                    "text-gray-500 line-through": row.getIsSelected(),
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
                  <FormattedMessage id="sessionAdministrator.No_Task_Found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
