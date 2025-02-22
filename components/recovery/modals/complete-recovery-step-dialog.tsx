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
import { FormProvider, useForm } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import CompleteRecoveryStepForm from "@/components/recovery/forms/complete-recovery-step-form";
import CompleteRecoveryStepButton from "@/components/recovery/buttons/complete-recovery-step-button";
import { useIntl } from "react-intl";

export default function CompleteRecoveryStepDialog({
  stepId,
  stepForm,
  ...props
}) {
  const formId = useId();
  const form = useForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  return stepForm ? (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{stepForm.title}</DialogTitle>
          </DialogHeader>
          <CompleteRecoveryStepForm
            formId={formId}
            stepId={stepId}
            stepForm={stepForm}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
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
                intl.formatMessage({ id: "recovery.complete" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  ) : (
    <CompleteRecoveryStepButton stepId={stepId} {...props} />
  );
}
