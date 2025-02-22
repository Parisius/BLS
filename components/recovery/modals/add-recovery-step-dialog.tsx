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
import { useRecoveryStepForm } from "@/lib/recovery/hooks";
import AddRecoveryStepForm from "@/components/recovery/forms/add-recovery-step-form";
import { useIntl } from "react-intl";

export default function AddRecoveryStepDialog({ recoveryId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const form = useRecoveryStepForm();
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
              {intl.formatMessage({ id: "recovery.newTask" })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({ id: "recovery.addTaskDescription" })}
            </DialogDescription>
          </DialogHeader>
          <AddRecoveryStepForm
            formId={formId}
            recoveryId={recoveryId}
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
                intl.formatMessage({ id: "recovery.add" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
