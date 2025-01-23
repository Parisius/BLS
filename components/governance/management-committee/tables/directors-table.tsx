"use client";
import DeleteDirectorButton from "@/components/governance/management-committee/buttons/delete-director-button";
import AddDirectorDialog from "@/components/governance/management-committee/modals/add-director-dialog";
import MandatesDialog from "@/components/governance/management-committee/modals/mandates-dialog";
import { UpdateDirectorDialog } from "@/components/governance/management-committee/modals/update-director-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import { useAllDirectors } from "@/services/api-sdk/models/management-committee/director";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, UserPlus, UserSearch, Vote } from "lucide-react";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <FormattedMessage id="managementCommittee.directorsTable.fullName" />
    ),
  },
  {
    accessorKey: "nationality",
    header: () => (
      <FormattedMessage id="managementCommittee.directorsTable.nationality" />
    ),
  },
  {
    accessorKey: "birthDate",
    header: () => (
      <FormattedMessage id="managementCommittee.directorsTable.birthDate" />
    ),
    cell: ({ row }) => formatDate(row.original.birthDate),
  },
  {
    accessorKey: "age",
    header: () => (
      <FormattedMessage id="managementCommittee.directorsTable.age" />
    ),
    cell: ({ row }) =>
      formatDuration(row.original.birthDate, new Date(), { format: ["years"] }),
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "birthPlace",
    header: () => (
      <FormattedMessage id="managementCommittee.directorsTable.birthPlace" />
    ),
  },
  {
    accessorKey: "address",
    header: () => (
      <FormattedMessage id="managementCommittee.directorsTable.address" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-end">
        <Tooltip>
          <UpdateDirectorDialog asChild directorId={row.original.id}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Pencil size={16} />
              </Button>
            </TooltipTrigger>
          </UpdateDirectorDialog>
          <TooltipContent>
            <FormattedMessage id="managementCommittee.directorsTable.editTooltip" />
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <MandatesDialog
            asChild
            directorId={row.original.id}
            mandates={row.original.mandates}
          >
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Vote size={16} />
              </Button>
            </TooltipTrigger>
          </MandatesDialog>
          <TooltipContent>
            {" "}
            <FormattedMessage id="managementCommittee.directorsTable.mandatesTooltip" />
          </TooltipContent>
        </Tooltip>

        <DeleteDirectorButton directorId={row.original.id} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
export default function DirectorsTable({
  containerClassName,
  tableWrapperClassName,
}: {
  containerClassName?: string;
  tableWrapperClassName?: string;
}) {
  const intl = useIntl();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const { data, isLoading, isError } = useAllDirectors();
  const table = useReactTable({
    data: data ?? [],
    columns,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      globalFilter,
      rowSelection,
      columnFilters,
    },
  });
  return (
    <div className={cn("space-y-5, overflow-auto", containerClassName)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            placeholder={intl.formatMessage({
              id: "managementCommittee.directorsTable.searchPlaceholder",
            })}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full pl-10 focus-visible:ring-0"
          />
          <UserSearch className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
        </div>
        <AddDirectorDialog asChild>
          <Button aria-label="Ajouter un directeur" className="gap-2">
            <UserPlus />
            <span className="sr-only sm:not-sr-only">
              {" "}
              <FormattedMessage id="managementCommittee.directorsTable.addButton" />
            </span>
          </Button>
        </AddDirectorDialog>
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
                    {/* {header.column.getCanFilter() ? (
                      <div className="py-2">
                        <TableFilter column={header.column} />
                      </div>
                    ) : null} */}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && !data && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <FormattedMessage id="managementCommittee.directorsTable.loading" />
                </TableCell>
              </TableRow>
            )}

            {isError && !data && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-destructive"
                >
                  <FormattedMessage id="managementCommittee.directorsTable.error" />
                </TableCell>
              </TableRow>
            )}

            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn({
                    "bg-card": index % 2 === 0,
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
              ))}

            {!isLoading && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <FormattedMessage id="managementCommittee.directorsTable.empty" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
