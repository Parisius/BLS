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
import { useForwardMeetingTaskForm } from "@/lib/governance/general-meeting/hooks";
import ForwardMeetingTaskForm from "@/components/governance/general-meeting/forms/forward-meeting-task-form";
import { FormattedMessage } from "react-intl";
export default function ForwardMeetingTaskDialog({ taskId, ...props }) {
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
              {" "}
              <FormattedMessage id="generalMeeting.share_task_modal_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="generalMeeting.share_task_modal_description" />
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
                <FormattedMessage id="generalMeeting.share_task_modal_cancel_btn" />
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
                <FormattedMessage id="generalMeeting.share_task_modal_share_btn" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
