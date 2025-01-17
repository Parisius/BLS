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
import { useOneAdministrator } from "@/services/api-sdk/models/administration-meeting/administrator";
import { useUpdateAdministratorForm } from "@/lib/governance/administration-meeting/hooks";
import UpdateAdministratorForm from "@/components/governance/administration-meeting/forms/update-administrator-form";
import { UpdateAdministratorDialogSuspense } from "./suspense";
import { FormattedMessage } from "react-intl";
export function UpdateAdministratorDialog({ administratorId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneAdministrator(administratorId);
  const form = useUpdateAdministratorForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (isError) {
    throw new Error("Failed to fetch data");
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
        share: data.share,
        sharePercentage: data.sharePercentage,
        type: data.type,
        quality: data.quality,
        role: data.role,
        denomination: data.denomination,
        companyHeadOffice: data.companyHeadOffice,
        companyNationality: data.companyNationality,
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
              <FormattedMessage id="sessionAdministrator.update_administrator_dialog_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.update_administrator_dialog_description" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateAdministratorDialogSuspense />
          ) : (
            <>
              <UpdateAdministratorForm
                formId={formId}
                className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
                administratorId={administratorId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="sessionAdministrator.update_administrator_dialog_cancel_button" />
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
                    <FormattedMessage id="sessionAdministrator.update_administrator_dialog_submit_button" />
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
