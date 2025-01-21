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
import { useProcedureTaskForm } from "@/lib/governance/administration-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { UpdateMeetingTaskDialogSuspense } from "@/components/governance/administration-meeting/modals/update-meeting-task-dialog/suspense";
import UpdateProcedureTaskForm from "@/components/governance/administration-meeting/forms/update-procedure-task-form";
import { useOneMeetingProcedureTask } from "@/services/api-sdk/models/administration-meeting";
import { FormattedMessage } from "react-intl";
export function UpdateProcedureTaskDialog({ taskId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneMeetingProcedureTask(taskId);
  const form = useProcedureTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (isError) {
    throw new Error("Failed to fetch meeting procedure task");
  }
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
      });
    }
  }, [data, form, isLoading]);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="sessionAdministrator.edit_Task_Title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.edit_Task_Description" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateMeetingTaskDialogSuspense />
          ) : (
            <>
              <UpdateProcedureTaskForm
                formId={formId}
                taskId={taskId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="sessionAdministrator.cancel_edit_task" />
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
                    <FormattedMessage id="sessionAdministrator.submit_edit_task" />
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
