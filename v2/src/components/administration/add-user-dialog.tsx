"use client";

import { useState } from "react";
import { UserPlus, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RoleSelect } from "@/components/administration/role-select";
import { SubsidiarySelect } from "@/components/administration/subsidiary-select";
import { useUserForm } from "@/lib/administration/forms";
import { useCreateUser } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const form = useUserForm();
  const { mutateAsync } = useCreateUser();
  const { t } = useDictionary();
  const tu = t.administration.users;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        username: values.username,
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        roleId: values.roleId,
        subsidiaryId: values.subsidiaryId,
      },
      {
        onSuccess: () => {
          toast.success(tu.createSuccess);
          form.reset();
          setOpen(false);
        },
        onError: () => toast.error(tu.createError),
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <UserPlus />
        <span className="sr-only sm:not-sr-only">{tu.newUser}</span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tu.dialogTitle}</DialogTitle>
          <DialogDescription>{tu.dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="add-user-form"
            className="grid grid-cols-2 gap-x-5 gap-y-6"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tu.fieldLastname}</FormLabel>
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
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tu.fieldFirstname}</FormLabel>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tu.fieldUsername}</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tu.fieldEmail}</FormLabel>
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
              name="roleId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{tu.fieldRole}</FormLabel>
                  <FormControl>
                    <RoleSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subsidiaryId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{tu.fieldSubsidiary}</FormLabel>
                  <FormControl>
                    <SubsidiarySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => form.reset()}
          >
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            form="add-user-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t.common.creating : t.common.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
