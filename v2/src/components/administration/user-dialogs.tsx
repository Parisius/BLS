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
import { RoleSelect } from "@/components/administration/role-select";
import { SubsidiarySelect } from "@/components/administration/subsidiary-select";
import { useUserForm } from "@/lib/administration/forms";
import {
  useDeleteUser,
  useResetUserPassword,
  useSetUserActive,
  useUpdateUser,
} from "@/lib/administration/hooks";
import type { User } from "@/lib/administration/users";
import { failureMessage } from "@/lib/api/error-message";
import { useDictionary } from "@/lib/i18n/locale-provider";

function EditUserBody({ user, onClose }: { user: User; onClose: () => void }) {
  const { t } = useDictionary();
  const tu = t.administration.users;
  const ta = t.adminActions;
  const formId = useId();
  const form = useUserForm({
    username: user.username ?? "",
    lastname: user.lastname ?? "",
    firstname: user.firstname ?? "",
    email: user.email ?? "",
    roleId: user.roles?.[0]?.id ?? "",
    subsidiaryId: user.subsidiary?.id ?? "",
  });
  const { mutateAsync } = useUpdateUser();

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({ userId: user.id!, args: values });
      toast.success(ta.userSaveSuccess);
      onClose();
    } catch (error) {
      toast.error(failureMessage(error, ta.userSaveError, t.permissions.forbidden));
    }
  });

  const text = (name: "lastname" | "firstname" | "username" | "email", label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
  );

  return (
    <>
      <Form {...form}>
        <form id={formId} noValidate className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2" onSubmit={handleSubmit}>
          {text("lastname", tu.fieldLastname)}
          {text("firstname", tu.fieldFirstname)}
          {text("username", tu.fieldUsername)}
          {text("email", tu.fieldEmail)}
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>{tu.fieldRole}</FormLabel>
                <FormControl>
                  <RoleSelect value={field.value} onValueChange={field.onChange} className="h-12 w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subsidiaryId"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>{tu.fieldSubsidiary}</FormLabel>
                <FormControl>
                  <SubsidiarySelect value={field.value} onValueChange={field.onChange} className="h-12 w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter className="gap-2">
        <DialogClose render={<Button type="button" variant="destructive" />}>{ta.cancel}</DialogClose>
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? ta.saving : ta.save}
        </Button>
      </DialogFooter>
    </>
  );
}

export function EditUserDialog({ user, onOpenChange }: { user: User | null; onOpenChange: (open: boolean) => void }) {
  const { t } = useDictionary();
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.adminActions.userEditTitle}</DialogTitle>
          <DialogDescription>{t.adminActions.userEditDescription}</DialogDescription>
        </DialogHeader>
        {/* Keyed so the form starts from this user's values every time. */}
        {user && <EditUserBody key={user.id} user={user} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

export type UserAction = "deactivate" | "reactivate" | "reset" | "delete";

/** One confirmation for the account actions that need one: status change, password reset, delete. */
export function UserActionDialog({
  user,
  action,
  onClose,
}: {
  user: User | null;
  action: UserAction | null;
  onClose: () => void;
}) {
  const { t } = useDictionary();
  const ta = t.adminActions;
  const tu = t.administration.users;
  const { mutateAsync: setActive } = useSetUserActive();
  const { mutateAsync: reset } = useResetUserPassword();
  const { mutateAsync: remove } = useDeleteUser();
  const [pending, setPending] = useState(false);

  const copy = {
    deactivate: { title: ta.deactivateTitle, description: ta.deactivateDescription, confirm: ta.userDeactivate, success: ta.deactivated, error: ta.statusError },
    reactivate: { title: ta.reactivateTitle, description: ta.reactivateDescription, confirm: ta.userReactivate, success: ta.reactivated, error: ta.statusError },
    reset: { title: ta.resetTitle, description: ta.resetDescription, confirm: ta.userResetPassword, success: ta.resetSent, error: ta.statusError },
    delete: { title: tu.deleteConfirmTitle, description: tu.deleteConfirmDescription, confirm: ta.delete, success: tu.deleteSuccess, error: tu.deleteError },
  };
  const current = action ? copy[action] : null;

  const handleConfirm = async () => {
    if (!user?.id || !action || !current) return;
    setPending(true);
    try {
      if (action === "deactivate") await setActive({ userId: user.id, active: false });
      else if (action === "reactivate") await setActive({ userId: user.id, active: true });
      else if (action === "reset") await reset(user.id);
      else await remove(user.id);
      toast.success(current.success);
      onClose();
    } catch (error) {
      toast.error(failureMessage(error, current.error, t.permissions.forbidden));
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={!!user && !!action} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{current?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{user?.username}</span> — {current?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">{ta.cancel}</AlertDialogCancel>
          <Button variant={action === "delete" || action === "deactivate" ? "destructive" : "default"} disabled={pending} onClick={() => void handleConfirm()}>
            {pending ? "..." : current?.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
