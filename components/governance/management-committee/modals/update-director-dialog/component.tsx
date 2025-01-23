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
import { useUpdateDirectorForm } from "@/lib/governance/management-committee/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneDirector } from "@/services/api-sdk/models/management-committee/director";
import UpdateDirectorForm from "@/components/governance/management-committee/forms/update-director-form";
import { UpdateDirectorDialogSuspense } from "./suspense";
import { FormattedMessage, useIntl } from "react-intl";

export function UpdateDirectorDialog({ directorId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const { data, isLoading, isError } = useOneDirector(directorId);
  const form = useUpdateDirectorForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  if (isError) {
    throw new Error(
      intl.formatMessage({ id: "managementCommittee.updateDirectorFetchError" })
    );
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        name: data.name,
        birthPlace: data.birthPlace,
        birthDate: data.birthDate,
        nationality: data.nationality,
        address: data.address,
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
              <FormattedMessage id="managementCommittee.updateDirectorTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="managementCommittee.updateDirectorDescription" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateDirectorDialogSuspense />
          ) : (
            <>
              <UpdateDirectorForm
                formId={formId}
                directorId={directorId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="managementCommittee.updateDirectorCancel" />
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
                    <FormattedMessage id="managementCommittee.updateDirectorSubmit" />
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
