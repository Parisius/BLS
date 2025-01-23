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
import { useOneMandate } from "@/services/api-sdk/models/management-committee";
import { useUpdateMandateForm } from "@/lib/governance/management-committee/hooks";
import { UpdateMandateDialogSuspense } from "@/components/governance/management-committee/modals/update-mandate-dialog/suspense";
import UpdateMandateForm from "@/components/governance/management-committee/forms/update-mandate-form";
import { FormattedMessage, useIntl } from "react-intl";

export function UpdateMandateDialog({ mandateId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const { data, isLoading, isError } = useOneMandate(mandateId);
  const form = useUpdateMandateForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  if (isError) {
    throw new Error(
      intl.formatMessage({ id: "managementCommittee.updateMandateFetchError" })
    );
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        startDate: data.startDate,
      });
    }
  }, [data, form, isLoading]);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="managementCommittee.updateMandateTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="managementCommittee.updateMandateDescription" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateMandateDialogSuspense />
          ) : (
            <>
              <UpdateMandateForm
                formId={formId}
                mandateId={mandateId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="managementCommittee.cancel" />
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
                    <FormattedMessage id="managementCommittee.updateMandateSubmit" />
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
