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
import { useForwardLitigationTaskForm } from "@/lib/litigation/hooks";
import ForwardLitigationTaskForm from "@/components/litigation/forms/forward-litigation-task-form";
import { useIntl } from "react-intl";

export default function ForwardLitigationTaskDialog({ taskId, ...props }) {
  const formId = useId();
  const form = useForwardLitigationTaskForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

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
                id: "litigation.litigation.tasks.transferTitle",
              })}{" "}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "litigation.litigation.tasks.transferDescription",
              })}{" "}
            </DialogDescription>
          </DialogHeader>
          <ForwardLitigationTaskForm
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
                  id: "litigation.litigation.tasks.transfer",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
