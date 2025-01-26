"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useCallback, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import CompleteIncidentTaskForm from "@/components/account-incident/forms/complete-incident-task-form";
import { useCompleteIncidentTaskForm } from "@/lib/account-incident/hooks";
import { useIntl } from "react-intl";

export default function CompleteIncidentTaskDialog({
  taskId,
  taskForm,
  ...props
}) {
  const formId = useId();
  const { form } = useCompleteIncidentTaskForm(taskForm.fields);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({ id: "incident.dialog.completeTask" })}
            </DialogTitle>
          </DialogHeader>
          <CompleteIncidentTaskForm
            formId={formId}
            taskId={taskId}
            taskForm={taskForm}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                {intl.formatMessage({ id: "incident.button.cancel" })}
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
                intl.formatMessage({ id: "incident.button.complete" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
