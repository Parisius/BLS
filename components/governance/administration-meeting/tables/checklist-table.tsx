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
import AddChecklistTaskFormDialog from "@/components/governance/administration-meeting/modals/add-checklist-task-form-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UpdateChecklistTaskDialog,
  UpdateChecklistTaskDialogErrorBoundary,
} from "@/components/governance/administration-meeting/modals/update-checklist-task-dialog";
import DeleteChecklistTaskButton from "@/components/governance/administration-meeting/buttons/delete-checklist-task-button";
import ChecklistTaskCheckbox from "@/components/governance/administration-meeting/buttons/checklist-task-checkbox";
import ChecklistAllTasksCheckbox from "@/components/governance/administration-meeting/buttons/checklist-all-tasks-checkbox";
import { useAllMeetingChecklistTasks } from "@/services/api-sdk/models/administration-meeting";
import { FormattedMessage, useIntl } from "react-intl";
export const columns = [
  {
    id: "select",
    header: ({ table }) => <ChecklistAllTasksCheckbox table={table} />,
    cell: ({ row }) => <ChecklistTaskCheckbox row={row} />,
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
          <UpdateChecklistTaskDialogErrorBoundary>
            <UpdateChecklistTaskDialog asChild taskId={row.original.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-accent"
                >
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
            </UpdateChecklistTaskDialog>
          </UpdateChecklistTaskDialogErrorBoundary>
          <TooltipContent>
            <FormattedMessage id="sessionAdministrator.attendant_table_action_modify" />
          </TooltipContent>
        </Tooltip>

        <DeleteChecklistTaskButton taskId={row.original.id} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
export default function ChecklistTable({
  meetingId,
  containerClassName,
  tableWrapperClassName,
}) {
  const intl = useIntl();
  const { data, isLoading, isError } = useAllMeetingChecklistTasks(meetingId);
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
    throw Error("Failed to fetch checklist tasks");
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
              id: "sessionAdministrator.attendant_placeholder_search",
            })}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm pl-10 focus-visible:ring-0"
          />
          <Search className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
        </div>
        <AddChecklistTaskFormDialog asChild meetingId={meetingId}>
          <Button aria-label="Ajouter une tâche" className="gap-2">
            <ListTodo />
            <span className="sr-only sm:not-sr-only">
              <FormattedMessage id="sessionAdministrator.attendant_button_add_task" />
            </span>
          </Button>
        </AddChecklistTaskFormDialog>
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
                  Aucune tâche trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
