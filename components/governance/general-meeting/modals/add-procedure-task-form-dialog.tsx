"use client";
import AddProcedureTaskForm from "@/components/governance/general-meeting/forms/add-procedure-task-form";
import { Button } from "@/components/ui/button";
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
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useProcedureTaskForm } from "@/lib/governance/general-meeting/hooks";
import { useCallback, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import { FormattedMessage } from "react-intl";
export default function AddProcedureTaskFormDialog({ meetingId, ...props }) {
  const formId = useId();
  const form = useProcedureTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {
    closeRef.current?.click();
  }, []);
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
          <AddProcedureTaskForm
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
