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
import { useForwardMeetingTaskForm } from "@/lib/governance/management-committee/hooks";
import ForwardMeetingTaskForm from "@/components/governance/management-committee/forms/forward-meeting-task-form";
import { useIntl } from "react-intl";

export default function ForwardMeetingTaskDialog({ taskId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const form = useForwardMeetingTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({
                id: "managementCommittee.task.transferTitle",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "managementCommittee.task.transferDescription",
              })}
            </DialogDescription>
          </DialogHeader>
          <ForwardMeetingTaskForm
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
                  id: "managementCommittee.task.cancelButton",
                })}
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
                  id: "managementCommittee.task.transferButton",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
