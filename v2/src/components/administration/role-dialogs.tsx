"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PermissionPicker } from "@/components/administration/permission-picker";
import { useRoleForm } from "@/lib/administration/forms";
import { useCreateRole, useDeleteRole, useUpdateRole } from "@/lib/administration/hooks";
import type { Role } from "@/lib/administration/roles";
import { failureMessage } from "@/lib/api/error-message";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Create (no `role`) or edit a role: its name and which permissions it grants. */
export function RoleFormDialog({
  role,
  open,
  onOpenChange,
}: {
  role?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tr = t.administration.roles;
  const ta = t.adminActions;
  const formId = useId();
  const editing = !!role;
  // The edit form starts from the role's current values (the dialog is remounted per role).
  const form = useRoleForm(
    role
      ? {
          title: role.name ?? "",
          permissionIds: (role.permissions ?? []).flatMap((permission) => (permission.id ? [permission.id] : [])),
        }
      : undefined,
  );
  const { mutateAsync: create } = useCreateRole();
  const { mutateAsync: update } = useUpdateRole();

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      if (role?.id) await update({ roleId: role.id, args: values });
      else await create(values);
      toast.success(editing ? ta.roleSaveSuccess : tr.createSuccess);
      if (!editing) form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(failureMessage(error, editing ? ta.roleSaveError : tr.createError, t.permissions.forbidden));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? ta.roleEditTitle : tr.dialogTitle}</DialogTitle>
          <DialogDescription>{editing ? ta.roleEditDescription : tr.dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id={formId} noValidate className="grid gap-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr.fieldTitle}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="h-12 pl-10" />
                      <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissionIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr.fieldPermissions}</FormLabel>
                  <PermissionPicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{ta.cancel}</DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? ta.saving : editing ? ta.save : t.common.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Opened from the table row; remounted per role so the form starts from its permissions. */
export function EditRoleDialog({ role, onOpenChange }: { role: Role | null; onOpenChange: (open: boolean) => void }) {
  if (!role) return null;
  return <RoleFormDialog key={role.id} role={role} open onOpenChange={onOpenChange} />;
}

export function DeleteRoleDialog({ role, onOpenChange }: { role: Role | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useDictionary();
  const ta = t.adminActions;
  const { mutateAsync } = useDeleteRole();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!role?.id) return;
    setPending(true);
    try {
      await mutateAsync(role.id);
      toast.success(ta.roleDeleteSuccess);
      onOpenChange(false);
    } catch (error) {
      toast.error(failureMessage(error, ta.roleDeleteError, t.permissions.forbidden));
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={!!role} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ta.roleDeleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{role?.name}</span> — {ta.roleDeleteDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">{ta.cancel}</AlertDialogCancel>
          <Button variant="destructive" disabled={pending} onClick={() => void handleDelete()}>
            {pending ? t.common.deleting : ta.delete}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
