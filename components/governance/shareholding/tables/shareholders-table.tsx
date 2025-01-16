"use client";
import DeleteShareholderButton from "@/components/governance/shareholding/buttons/delete-shareholder-button";
import PrintSharesCertificateButton from "@/components/governance/shareholding/buttons/print-shares-certificate-button";
import AddShareholderDialog from "@/components/governance/shareholding/modals/add-shareholder-dialog";
import { UpdateShareholderDialog } from "@/components/governance/shareholding/modals/update-shareholder-dialog";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useAllShareholders } from "@/services/api-sdk/models/shareholding";
import {
  corporateTypes,
  shareholderTypes,
} from "@/services/api-sdk/types/shareholding";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Printer, UserPlus, UserSearch } from "lucide-react";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface Shareholder {
  id: string;
  name: string;
  nationality: string;
  address: string;
  type: string;
  corporateType: string;
  unencumberedShares: number;
  encumberedShares: number;
  sharePercentage: number;
}

export default function ShareholdersTable({
  containerClassName,
  tableWrapperClassName,
}: {
  containerClassName?: string;
  tableWrapperClassName?: string;
}) {
  const intl = useIntl();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { data: initialData, isLoading, isError } = useAllShareholders();
  const [tableData, setTableData] = React.useState<Shareholder[]>([]);

  React.useEffect(() => {
    if (initialData) {
      setTableData(initialData);
    }
  }, [initialData]);

  const handleDelete = (id: string) => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: ColumnDef<Shareholder>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_name" />
        </div>
      ),
    },
    {
      accessorKey: "nationality",
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_nationality" />
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_address" />
        </div>
      ),
    },
    {
      id: "type",
      accessorFn: (row) =>
        shareholderTypes.find((type) => type.value === row.type)?.label,
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_type" />
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    },
    {
      id: "category",
      accessorFn: (row) =>
        corporateTypes.find((type) => type.value === row.corporateType)?.label,
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_category" />
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "unencumberedShares",
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_unencumbered_shares" />
        </div>
      ),
    },
    {
      accessorKey: "encumberedShares",
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_encumbered_shares" />
        </div>
      ),
    },
    {
      id: "totalShares",
      accessorFn: (row) => row.encumberedShares + row.unencumberedShares,
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_total_shares" />
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "sharePercentage",
      header: () => (
        <div>
          <FormattedMessage id="shareholding.table_headers_share_percentage" />
        </div>
      ),
      cell: ({ getValue }) => `${getValue()}%`,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center">
          <FormattedMessage id="shareholding.table_headers_actions" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap text-center">
          <Tooltip>
            <UpdateShareholderDialog asChild shareholderId={row.original.id}>
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
            </UpdateShareholderDialog>
            <TooltipContent>
              <FormattedMessage id="shareholding.actions_edit" />
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <PrintSharesCertificateButton
                shareholderId={row.original.id}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Printer size={16} />
              </PrintSharesCertificateButton>
            </TooltipTrigger>
            <TooltipContent>
              <FormattedMessage id="shareholding.actions_print_certificate" />
            </TooltipContent>
          </Tooltip>

          <DeleteShareholderButton
            shareholderId={row.original.id}
            onSuccess={() => handleDelete(row.original.id)}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
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
              id: "shareholding.search_placeholder",
            })}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full pl-10 focus-visible:ring-0"
          />
          <UserSearch className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
        </div>
        <AddShareholderDialog asChild>
          <Button
            aria-label={intl.formatMessage({
              id: "add_shareholder_button_aria_label",
            })}
            className="gap-2"
          >
            <UserPlus />
            <span className="sr-only sm:not-sr-only">
              <FormattedMessage id="shareholding.add_shareholder_button_aria_label" />
            </span>
          </Button>
        </AddShareholderDialog>
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
            {isLoading && !tableData.length && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <FormattedMessage id="shareholding.loading" />
                </TableCell>
              </TableRow>
            )}

            {isError && !tableData.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-destructive"
                >
                  <FormattedMessage id="shareholding.errorLoading" />
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

            {!isLoading && tableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <FormattedMessage id="shareholding.no_shareholders" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
