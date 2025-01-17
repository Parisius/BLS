"use client";
import * as React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Pencil, UserPlus, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  administratorQualities,
  administratorRoles,
} from "@/services/api-sdk/types/administration-meeting";
import { UpdateAdministratorDialog } from "@/components/governance/administration-meeting/modals/update-administrator-dialog";
import DeleteAdministratorButton from "@/components/governance/administration-meeting/buttons/delete-administrator-button";
import { useAllAdministrators } from "@/services/api-sdk/models/administration-meeting/administrator";
import AddAdministratorDialog from "@/components/governance/administration-meeting/modals/add-administrator-dialog";
import TableFilter from "@/components/ui/table-filter";
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
        <FormattedMessage id="sessionAdministrator.administrators_table_column_name" />
      </div>
    ),
  },
  {
    accessorKey: "nationality",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_table_column_nationality" />
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_table_column_role" />
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
        <FormattedMessage id="sessionAdministrator.administrators_table_column_quality" />
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
    accessorKey: "birthDate",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_table_column_birthdate" />
      </div>
    ),
    cell: ({ row }) => formatDate(row.original.birthDate),
  },
  {
    accessorKey: "age",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_table_column_age" />
      </div>
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
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_table_column_birthplace" />
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => (
      <div>
        <FormattedMessage id="sessionAdministrator.administrators_table_column_address" />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-nowrap text-end">
        <Tooltip>
          <UpdateAdministratorDialog asChild administratorId={row.original.id}>
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
          </UpdateAdministratorDialog>
          <TooltipContent>
            <FormattedMessage id="sessionAdministrator.administrators_table_actions_edit_tooltip" />
          </TooltipContent>
        </Tooltip>

        <DeleteAdministratorButton administratorId={row.original.id} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
export default function AdministratorsTable({
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
              id: "sessionAdministrator.administrators_table_search_placeholder",
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
              <FormattedMessage id="sessionAdministrator.administrators_table_add_button" />
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
                  <FormattedMessage id="sessionAdministrator.administrators_table_loading_message" />
                </TableCell>
              </TableRow>
            )}

            {isError && !data && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-destructive"
                >
                  <FormattedMessage id="sessionAdministrator.administrators_table_error_message" />
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
                  <FormattedMessage id="sessionAdministrator.administrators_table_no_results_message" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
