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
import { useTaskForm } from "@/lib/governance/administration-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import UpdateMeetingTaskForm from "@/components/governance/administration-meeting/forms/update-meeting-task-form";
import { UpdateMeetingTaskDialogSuspense } from "@/components/governance/administration-meeting/modals/update-meeting-task-dialog/suspense";
import { useOneMeetingTask } from "@/services/api-sdk/models/administration-meeting";
import { FormattedMessage } from "react-intl";
export function UpdateMeetingTaskDialog({ taskId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneMeetingTask(taskId);
  const form = useTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (isError) {
    throw new Error("Failed to fetch meeting task");
  }
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        dueDate: data.dueDate,
        assignee: data.assignee,
        supervisor: data.supervisor,
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
              {" "}
              <FormattedMessage id="sessionAdministrator.addTaskDialogTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.addTaskDialogDescription" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateMeetingTaskDialogSuspense />
          ) : (
            <>
              <UpdateMeetingTaskForm
                formId={formId}
                taskId={taskId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="sessionAdministrator.addTaskDialogCancelButton" />
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
                    <FormattedMessage id="sessionAdministrator.addTaskDialogSubmitButton" />
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
