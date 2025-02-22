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
import { useForwardRecoveryStepForm } from "@/lib/recovery/hooks";
import ForwardRecoveryStepForm from "@/components/recovery/forms/forward-recovery-step-form";
import { useIntl } from "react-intl";

export default function ForwardRecoveryStepDialog({ eventId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const form = useForwardRecoveryStepForm();
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
              {intl.formatMessage({ id: "recovery.taskTransfer" })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({ id: "recovery.taskTransferDescription" })}
            </DialogDescription>
          </DialogHeader>
          <ForwardRecoveryStepForm
            formId={formId}
            eventId={eventId}
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
                intl.formatMessage({ id: "recovery.transfer" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
