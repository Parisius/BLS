"use client";
import * as React from "react";
import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
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
import { useCurrentUser } from "@/services/api-sdk/models/user/user";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import DeleteUserButton from "@/components/administration/user/buttons/delete-user-button";
import { useAllUsers } from "@/services/api-sdk/models/administration/user/user";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  className?: string;
}

export const getColumns = (currentUserId?: string) => [
  {
    accessorKey: "username",
    header: "Nom d'utilisateur",
  },
  {
    accessorKey: "lastname",
    header: "Nom & Prénom (s)",
  },
  {
    accessorKey: "firstname",
    header: "Prénoms",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="space-x-2">
        {currentUserId === row.original.id ? (
          <>
            <span>{row.original.email}</span>
            <span className="italic">(Vous)</span>
          </>
        ) : (
          <Button asChild variant="link" className="p-0">
            <a
              href={`mailto:${row.original.email}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {row.original.email}
            </a>
          </Button>
        )}
      </div>
    ),
  },
  {
    accessorKey: "roles",
    header: "Rôle",
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-2">
        {row.original.roles.map(({ id, title }) => (
          <Badge key={id} className="bg-accent text-accent-foreground">
            {title}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "subsidiary.title",
    header: "Filiale",
  },
  {
    id: "actions",
    cell: ({ row }) =>
      currentUserId !== row.original.id && (
        <div className="text-end">
          <DeleteUserButton asChild userId={row.original.id}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-destructive"
            >
              <Trash />
            </Button>
          </DeleteUserButton>
        </div>
      ),
    enableSorting: false,
    enableHiding: false,
  },
];

export default function UsersTable({ className }: UsersTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllUsers();

  const columns = useMemo(() => getColumns(currentUser?.id), [currentUser]);

  const users = useMemo(() => {
    if (data && currentUser) {
      const currentUserIndex = data.findIndex(
        (user) => user.id === currentUser?.id
      );
      return data
        .toSpliced(currentUserIndex, 1)
        .toSpliced(0, 0, data[currentUserIndex]);
    }
    return [];
  }, [currentUser, data]);

  const table = useReactTable({
    data: users,
    columns,
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className={cn("space-y-5", className)}>
      <Table className="border">
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
          {isLoading && !data && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Chargement...
              </TableCell>
            </TableRow>
          )}
          {isError && !data && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-destructive"
              >
                Erreur lors du chargement
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
                  "opacity-50": currentUser?.id === row.original.id,
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
