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
import { useForwardMeetingTaskForm } from "@/lib/governance/administration-meeting/hooks";
import ForwardMeetingTaskForm from "@/components/governance/administration-meeting/forms/forward-meeting-task-form";
import { FormattedMessage } from "react-intl";
export default function ForwardMeetingTaskDialog({ taskId, ...props }) {
  const formId = useId();
  const form = useForwardMeetingTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handlError = useCallback(() => {}, []);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {" "}
              <FormattedMessage id="sessionAdministrator.transferTaskTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.transferTaskDescription" />
            </DialogDescription>
          </DialogHeader>
          <ForwardMeetingTaskForm
            formId={formId}
            taskId={taskId}
            onSuccess={handleSuccess}
            onError={handlError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="sessionAdministrator.cancel" />
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
                <FormattedMessage id="sessionAdministrator.transfer" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
