"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ellipsis, KeyRound, Pencil, Power, PowerOff, Trash } from "lucide-react";
import { useAllUsers } from "@/lib/administration/hooks";
import type { User } from "@/lib/administration/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserDialog, UserActionDialog, type UserAction } from "@/components/administration/user-dialogs";
import { usePermissions } from "@/lib/auth/use-permissions";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionary";

type Pick = (user: User, action: UserAction | "edit") => void;

function getColumns(t: Dictionary, pick: Pick): ColumnDef<User>[] {
  return [
    { accessorKey: "username", header: t.administration.users.columnUsername },
    { accessorKey: "lastname", header: t.administration.users.columnLastname },
    { accessorKey: "firstname", header: t.administration.users.columnFirstname },
    {
      accessorKey: "email",
      header: t.administration.users.columnEmail,
      cell: ({ row }) => (
        <Button
          variant="link"
          className="h-auto p-0"
          nativeButton={false}
          render={
            <a
              href={`mailto:${row.original.email}`}
              target="_blank"
              rel="noreferrer noopener"
            />
          }
        >
          {row.original.email}
        </Button>
      ),
    },
    {
      id: "roles",
      header: t.administration.users.columnRole,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          {row.original.roles?.map((role) => (
            <Badge key={role.id} variant="secondary">
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "subsidiary",
      header: t.administration.users.columnSubsidiary,
      cell: ({ row }) => row.original.subsidiary?.name,
    },
    {
      id: "status",
      cell: ({ row }) =>
        row.original.is_active === false ? <Badge variant="outline">{t.adminActions.inactive}</Badge> : null,
    },
    {
      id: "actions",
      cell: ({ row }) => <UserRowMenu user={row.original} pick={pick} label={t.adminActions.actions} />,
    },
  ];
}

function UserRowMenu({ user, pick, label }: { user: User; pick: Pick; label: string }) {
  const { t } = useDictionary();
  const ta = t.adminActions;
  const { can } = usePermissions();
  const items = [
    can("user.update") && { key: "edit", icon: Pencil, text: ta.edit, run: () => pick(user, "edit") },
    can("user.deactivate") &&
      (user.is_active === false
        ? { key: "reactivate", icon: Power, text: ta.userReactivate, run: () => pick(user, "reactivate") }
        : { key: "deactivate", icon: PowerOff, text: ta.userDeactivate, run: () => pick(user, "deactivate") }),
    can("user.reset_password") && { key: "reset", icon: KeyRound, text: ta.userResetPassword, run: () => pick(user, "reset") },
  ].filter(Boolean) as { key: string; icon: typeof Pencil; text: string; run: () => void }[];
  const canDelete = can("user.delete");
  if (items.length === 0 && !canDelete) return null;

  return (
    <div className="text-end">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={label} className="rounded-full" />}>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map(({ key, icon: Icon, text, run }) => (
            <DropdownMenuItem key={key} className="gap-2" onClick={run}>
              <Icon /> {text}
            </DropdownMenuItem>
          ))}
          {canDelete && (
            <>
              {items.length > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => pick(user, "delete")}>
                <Trash /> {ta.delete}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function UsersTable() {
  const { data, isLoading, isError } = useAllUsers();
  const { t } = useDictionary();
  // The dialogs live outside the row menu: dialogs inside dropdown content unmount when the menu closes.
  const [editing, setEditing] = useState<User | null>(null);
  const [acting, setActing] = useState<{ user: User; action: UserAction } | null>(null);
  const columns = useMemo(
    () =>
      getColumns(t, (user, action) => (action === "edit" ? setEditing(user) : setActing({ user, action }))),
    [t],
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
                {t.administration.users.notFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EditUserDialog user={editing} onOpenChange={(open) => !open && setEditing(null)} />
      <UserActionDialog user={acting?.user ?? null} action={acting?.action ?? null} onClose={() => setActing(null)} />
    </div>
  );
}
