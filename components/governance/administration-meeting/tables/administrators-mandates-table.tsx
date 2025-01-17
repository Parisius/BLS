"use client";
import AddAdministratorDialog from "@/components/governance/administration-meeting/modals/add-administrator-dialog";
import MandatesDialog from "@/components/governance/administration-meeting/modals/mandates-dialog";
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
import { useAllAdministrators } from "@/services/api-sdk/models/administration-meeting/administrator";
import {
  administratorQualities,
  administratorRoles,
} from "@/services/api-sdk/types/administration-meeting";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { min } from "date-fns";
import { UserPlus, UserSearch, Vote } from "lucide-react";
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
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_name" />
      </div>
    ),
  },
  {
    accessorKey: "nationality",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_nationality" />
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_role" />
      </div>
    ),
    cell: ({ row }) =>
      administratorRoles.find((role) => role.value === row.original.role)
        ?.label,
    meta: {
      filterVariant: "select",
      filterOptions: administratorRoles,
    },
  },
  {
    accessorKey: "quality",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_quality" />
      </div>
    ),
    cell: ({ row }) =>
      administratorQualities.find(
        (quality) => quality.value === row.original.quality
      )?.label,
    meta: {
      filterVariant: "select",
      filterOptions: administratorQualities,
    },
  },
  {
    accessorKey: "dateOfFirstAppointment",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_first_appointment" />
      </div>
    ),
    cell: ({ row }) => formatDate(row.original.mandates[0].startDate),
  },
  {
    accessorKey: "mandateDuration",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_mandate_duration" />
      </div>
    ),
    cell: ({ row }) =>
      formatDuration(
        row.original.mandates[0].startDate,
        row.original.mandates[0].endDate
      ),
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "dateOfLastRenewal",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_last_renewal" />
      </div>
    ),
    cell: ({ row }) =>
      row.original.mandates.length > 1
        ? formatDate(row.original.mandates.slice(-2)[0].renewalDate)
        : "-",
  },
  {
    accessorKey: "expirationDate",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_expiration_date" />
      </div>
    ),
    cell: ({ row }) => formatDate(row.original.mandates.slice(-1)[0].endDate),
  },
  {
    accessorKey: "totalMandateDuration",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_total_duration" />
      </div>
    ),
    cell: ({ row }) =>
      formatDuration(
        row.original.mandates[0].startDate,
        min([row.original.mandates.slice(-1)[0].endDate, new Date()])
      ),
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "observations",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_mandates_table_column_observations" />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-nowrap text-end">
        <Tooltip>
          <MandatesDialog
            asChild
            administratorId={row.original.id}
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
            <FormattedMessage id="sessionAdministrator.administrators_mandates_table_mandates_tooltip" />
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
export default function AdministratorsMandatesTable({
  containerClassName,
  tableWrapperClassName,
}: {
  containerClassName?: string;
  tableWrapperClassName: string;
}) {
  const intl = useIntl();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const { data, isLoading, isError } = useAllAdministrators();
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
    <div className={cn("space-y-5 overflow-auto", containerClassName)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            placeholder={intl.formatMessage({
              id: "sessionAdministrator.administrators_mandates_table_search_placeholder",
            })}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full pl-10 focus-visible:ring-0"
          />
          <UserSearch className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
        </div>
        <AddAdministratorDialog asChild>
          <Button aria-label="Ajouter un directeur" className="gap-2">
            <UserPlus />
            <span className="sr-only sm:not-sr-only">
              <FormattedMessage id="sessionAdministrator.administrators_mandates_table_add_button" />
            </span>
          </Button>
        </AddAdministratorDialog>
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
                  <FormattedMessage id="sessionAdministrator.administrators_mandates_table_loading" />
                </TableCell>
              </TableRow>
            )}

            {isError && !data && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-destructive"
                >
                  <FormattedMessage id="sessionAdministrator.administrators_mandates_table_error" />
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
                  <FormattedMessage id="sessionAdministrator.administrators_mandates_table_no_results" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
