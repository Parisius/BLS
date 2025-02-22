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
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import UpdateRecoveryStepForm from "@/components/recovery/forms/update-recovery-step-form";
import { useOneRecoveryStep } from "@/services/api-sdk/models/recovery";
import { useRecoveryStepForm } from "@/lib/recovery/hooks";
import { UpdateRecoveryStepDialogSuspense } from "./suspense";
import { useIntl } from "react-intl";

export function UpdateRecoveryStepDialog({ stepId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const { data, isLoading, isError } = useOneRecoveryStep(stepId);
  const form = useRecoveryStepForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  if (isError) {
    throw new Error(intl.formatMessage({ id: "recovery.fetchError" }));
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        dueDate: data.maxDueDate ?? data.minDueDate,
      });
    }
  }, [data, form, isLoading]);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({ id: "recovery.editTask" })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({ id: "recovery.editTaskDescription" })}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateRecoveryStepDialogSuspense />
          ) : (
            <>
              <UpdateRecoveryStepForm
                formId={formId}
                stepId={stepId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    {intl.formatMessage({ id: "recovery.cancel" })}
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
                    intl.formatMessage({ id: "recovery.edit" })
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
