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
import React, { useCallback, useEffect, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneLitigationTask } from "@/services/api-sdk/models/litigation";
import { useLitigationTaskForm } from "@/lib/litigation/hooks";
import UpdateLitigationTaskForm from "@/components/litigation/forms/update-litigation-task-form";
import { UpdateLitigationTaskDialogSuspense } from "./suspense";
import { useIntl } from "react-intl";

export function UpdateLitigationTaskDialog({ taskId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneLitigationTask(taskId);
  const form = useLitigationTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to fetch litigation task");
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        dueDate: data.maxDueDate ?? data.minDueDate,
      });
    }
  }, [data, form, isLoading]);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({
                id: "litigation.litigation.tasks.editTask",
              })}{" "}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "litigation.litigation.tasks.editTaskDescription",
              })}{" "}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateLitigationTaskDialogSuspense />
          ) : (
            <>
              <UpdateLitigationTaskForm
                formId={formId}
                taskId={taskId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    {intl.formatMessage({
                      id: "litigation.litigation.tasks.cancel",
                    })}{" "}
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
                    intl.formatMessage({
                      id: "litigation.litigation.tasks.edit",
                    })
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
