"use client";

import { useState } from "react";
import { ShieldPlus, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRoleForm } from "@/lib/administration/forms";
import { useAllPermissions, useCreateRole } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AddRoleDialog() {
  const [open, setOpen] = useState(false);
  const form = useRoleForm();
  const { mutateAsync } = useCreateRole();
  const {
    data: permissions,
    isLoading: loadingPermissions,
    isError: permissionsError,
  } = useAllPermissions();
  const { t } = useDictionary();
  const tr = t.administration.roles;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        title: values.title,
        permissionIds: values.permissionIds,
      },
      {
        onSuccess: () => {
          toast.success(tr.createSuccess);
          form.reset();
          setOpen(false);
        },
        onError: () => toast.error(tr.createError),
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <ShieldPlus />
        <span className="sr-only sm:not-sr-only">{tr.newRole}</span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tr.dialogTitle}</DialogTitle>
          <DialogDescription>{tr.dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="add-role-form" className="grid gap-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr.fieldTitle}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="h-12 pl-10" />
                      <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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
                  <FormControl>
                    <div className="grid max-h-56 gap-3 overflow-y-auto rounded-lg border p-3">
                      {loadingPermissions && (
                        <>
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-full" />
                        </>
                      )}
                      {permissionsError && !loadingPermissions && (
                        <p className="text-sm text-destructive">
                          {t.common.loadError}
                        </p>
                      )}
                      {!loadingPermissions &&
                        !permissionsError &&
                        (permissions?.length ?? 0) === 0 && (
                        <p className="text-sm text-muted-foreground">
                          {tr.noPermissions}
                        </p>
                      )}
                      {permissions?.map((permission) => {
                        const id = String(permission.id);
                        const checked = field.value.includes(id);
                        return (
                          <div key={id} className="flex items-start gap-2">
                            <Checkbox
                              id={`permission-${id}`}
                              checked={checked}
                              onCheckedChange={(value) => {
                                field.onChange(
                                  value
                                    ? [...field.value, id]
                                    : field.value.filter((v) => v !== id),
                                );
                              }}
                            />
                            <Label
                              htmlFor={`permission-${id}`}
                              className="flex flex-col gap-0.5 font-normal"
                            >
                              {permission.label ?? permission.name}
                              {permission.description && (
                                <span className="text-xs text-muted-foreground">
                                  {permission.description}
                                </span>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="destructive" onClick={() => form.reset()}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form="add-role-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t.common.creating : t.common.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
