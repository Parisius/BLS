"use client";

import { toast } from "sonner";
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStepForm, type StepFormValues } from "@/lib/shared/step-form";
import type { StepDialogLabels, DeleteStepLabels } from "@/components/shared/workflow-tasks/labels";

function StepFields({ form, labels }: { form: ReturnType<typeof useStepForm>; labels: StepDialogLabels }) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.titleLabel}</FormLabel>
            <FormControl>
              <Input {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.dueDate}</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

interface StepFormDialogProps {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults?: Partial<StepFormValues>;
  onSubmit: (values: StepFormValues) => Promise<void>;
  labels: StepDialogLabels;
}

/** Add / edit form for a user-created step. */
export function StepFormDialog({ mode, open, onOpenChange, defaults, onSubmit, labels }: StepFormDialogProps) {
  const form = useStepForm(defaults);
  const formId = `${mode}-step-form`;

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(mode === "add" ? labels.addSuccess : labels.editSuccess);
      if (mode === "add") form.reset();
      onOpenChange(false);
    } catch {
      toast.error(mode === "add" ? labels.addError : labels.editError);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? labels.addTitle : labels.editTitle}</DialogTitle>
          <DialogDescription>{mode === "add" ? labels.addDescription : labels.editDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id={formId} noValidate className="space-y-5" onSubmit={handleSubmit}>
            <StepFields form={form} labels={labels} />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {labels.cancel}
          </DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : mode === "add" ? labels.add : labels.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** The mutation is owned by the caller: this dialog unmounts as soon as it closes, which would drop the result callbacks. */
export function DeleteStepDialog({
  onConfirm,
  onClose,
  labels,
}: {
  onConfirm: () => void;
  onClose: () => void;
  labels: DeleteStepLabels;
}) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.title}</AlertDialogTitle>
          <AlertDialogDescription>{labels.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            {labels.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
