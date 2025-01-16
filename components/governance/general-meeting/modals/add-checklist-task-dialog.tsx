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
import AddChecklistTaskForm from "@/components/governance/general-meeting/forms/add-checklist-task-form";
import { useChecklistTaskForm } from "@/lib/governance/general-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { FormattedMessage } from "react-intl";
export default function AddChecklistTaskDialog({ meetingId, ...props }) {
  const formId = useId();
  const form = useChecklistTaskForm();
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
              <FormattedMessage id="generalMeeting.add_tast_modal_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="generalMeeting.add_tast_modal_description" />
            </DialogDescription>
          </DialogHeader>
          <AddChecklistTaskForm
            formId={formId}
            meetingId={meetingId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="generalMeeting.cancel_task_btn" />
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
                <FormattedMessage id="generalMeeting.add_task_btn" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
