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
import { useSubsidiaryForm } from "@/lib/administration/forms";
import { useDeleteSubsidiary, useUpdateSubsidiary } from "@/lib/administration/hooks";
import type { Subsidiary } from "@/lib/administration/subsidiaries";
import { failureMessage } from "@/lib/api/error-message";
import { useDictionary } from "@/lib/i18n/locale-provider";

function EditSubsidiaryBody({ subsidiary, onClose }: { subsidiary: Subsidiary; onClose: () => void }) {
  const { t } = useDictionary();
  const ts = t.administration.subsidiaries;
  const ta = t.adminActions;
  const formId = useId();
  const form = useSubsidiaryForm({
    title: subsidiary.name ?? "",
    country: subsidiary.country ?? "",
    address: subsidiary.address ?? "",
  });
  const { mutateAsync } = useUpdateSubsidiary();

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({ subsidiaryId: subsidiary.id!, args: values });
      toast.success(ta.subsidiarySaveSuccess);
      onClose();
    } catch (error) {
      toast.error(failureMessage(error, ta.subsidiarySaveError, t.permissions.forbidden));
    }
  });

  return (
    <>
      <Form {...form}>
        <form id={formId} noValidate className="grid gap-6" onSubmit={handleSubmit}>
          {(
            [
              ["title", ts.fieldName],
              ["country", ts.fieldCountry],
              ["address", ts.fieldAddress],
            ] as const
          ).map(([name, label]) => (
            <FormField
              key={name}
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
          ))}
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

export function EditSubsidiaryDialog({
  subsidiary,
  onOpenChange,
}: {
  subsidiary: Subsidiary | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  return (
    <Dialog open={!!subsidiary} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.adminActions.subsidiaryEditTitle}</DialogTitle>
          <DialogDescription>{t.adminActions.subsidiaryEditDescription}</DialogDescription>
        </DialogHeader>
        {subsidiary && (
          <EditSubsidiaryBody key={subsidiary.id} subsidiary={subsidiary} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DeleteSubsidiaryDialog({
  subsidiary,
  onOpenChange,
}: {
  subsidiary: Subsidiary | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const ta = t.adminActions;
  const { mutateAsync } = useDeleteSubsidiary();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!subsidiary?.id) return;
    setPending(true);
    try {
      await mutateAsync(subsidiary.id);
      toast.success(ta.subsidiaryDeleteSuccess);
      onOpenChange(false);
    } catch (error) {
      // 409 "users still attached": the backend's message explains it.
      toast.error(failureMessage(error, ta.subsidiaryDeleteError, t.permissions.forbidden));
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={!!subsidiary} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ta.subsidiaryDeleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{subsidiary?.name}</span> — {ta.subsidiaryDeleteDescription}
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
