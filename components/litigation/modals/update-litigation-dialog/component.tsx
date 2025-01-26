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
import { useOneLitigation } from "@/services/api-sdk/models/litigation/litigation";
import { useLitigationForm } from "@/lib/litigation/hooks";
import UpdateLitigationForm from "@/components/litigation/forms/update-litigation-form";
import { UpdateLitigationDialogSuspense } from "./suspense";
import { useIntl } from "react-intl";

export function UpdateLitigationDialogComponent({ litigationId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneLitigation(litigationId);
  const { form } = useLitigationForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to fetch litigation");
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        caseNumber: data.caseNumber,
        natureId: data.nature.id,
        jurisdictionId: data.jurisdiction.id,
        jurisdictionLocation: data.jurisdictionLocation,
        hasProvisions: data.hasProvisions,
        parties: data.parties.map((party) => ({
          partyId: party.id,
          category: party.category,
          type: party.type,
        })),
      });
    }
  }, [data, form, isLoading]);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({ id: "litigation.litigation.update.title" })}{" "}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "litigation.litigation.update.description",
              })}{" "}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateLitigationDialogSuspense />
          ) : (
            <>
              <UpdateLitigationForm
                formId={formId}
                litigationId={litigationId}
                className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    {intl.formatMessage({
                      id: "litigation.litigation.update.cancel",
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
                      id: "litigation.litigation.update.edit",
                    })
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
