"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useCallback, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useLitigationTaskForm } from "@/lib/litigation/hooks";
import AddLitigationTaskForm from "@/components/litigation/forms/add-litigation-task-form";
import { FormattedMessage } from "react-intl";

export default function AddLitigationTaskDialog({ litigationId, ...props }) {
  const formId = useId();
  const form = useLitigationTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="litigation.litigation.tasks.newTask" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="litigation.litigation.tasks.addNewTask" />
            </DialogDescription>
          </DialogHeader>
          <AddLitigationTaskForm
            formId={formId}
            litigationId={litigationId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="litigation.litigation.tasks.cancel" />
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form={formId}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                <FormattedMessage id="litigation.litigation.tasks.add" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
