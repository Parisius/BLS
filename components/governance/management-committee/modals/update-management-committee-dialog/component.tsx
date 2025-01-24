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
import { useManagementCommitteeForm } from "@/lib/governance/management-committee/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneManagementCommittee } from "@/services/api-sdk/models/management-committee";
import UpdateManagementCommitteeForm from "@/components/governance/management-committee/forms/update-management-committee-form";
import { UpdateManagementCommitteeDialogSuspense } from "./suspense";
import { FormattedMessage, useIntl } from "react-intl";

export function UpdateManagementCommitteeDialog({ meetingId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const { data, isLoading, isError } = useOneManagementCommittee(meetingId);
  const form = useManagementCommitteeForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  if (isError) {
    throw new Error(
      intl.formatMessage({
        id: "managementCommittee.updateCommitteeFetchError",
      })
    );
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        meetingDate: data.meetingDate,
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
              <FormattedMessage id="managementCommittee.updateCommitteeTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="managementCommittee.updateCommitteeDescription" />
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <UpdateManagementCommitteeDialogSuspense />
          ) : (
            <>
              <UpdateManagementCommitteeForm
                formId={formId}
                meetingId={meetingId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="managementCommittee.cancelButton" />
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
                    <FormattedMessage id="managementCommittee.updateCommitteeButton" />
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
