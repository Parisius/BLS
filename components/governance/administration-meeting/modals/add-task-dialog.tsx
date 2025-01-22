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
import AddMeetingTaskForm from "@/components/governance/administration-meeting/forms/add-meeting-task-form";
import { useTaskForm } from "@/lib/governance/administration-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { FormattedMessage } from "react-intl";
export default function AddTaskDialog({ meetingId, ...props }) {
  const formId = useId();
  const form = useTaskForm();
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
              <FormattedMessage id="sessionAdministrator.addTaskDialogTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.addTaskDialogDescription" />
            </DialogDescription>
          </DialogHeader>
          <AddMeetingTaskForm
            formId={formId}
            meetingId={meetingId}
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
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
