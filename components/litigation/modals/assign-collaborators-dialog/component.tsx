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
import { useAssignCollaboratorsForm } from "@/lib/litigation/hooks";
import AssignCollaboratorsForm from "@/components/litigation/forms/assign-collaborators-form";
import { AssignCollaboratorsDialogSuspense } from "./suspense";
import { useIntl } from "react-intl";
export function AssignCollaboratorsDialogComponent({ litigationId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const { data, isLoading, isError } = useOneLitigation(litigationId);
  const { form } = useAssignCollaboratorsForm();
  const closeRef = useRef<HTMLButtonElement>(null);

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
        users: data.users.map(({ id }) => ({ id })),
        lawyers: data.lawyers.map(({ id }) => ({ id })),
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
              {intl.formatMessage({
                id: "litigation.litigation.assignCollaboratorsTitle",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "litigation.litigation.assignCollaboratorsDescription",
              })}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <AssignCollaboratorsDialogSuspense />
          ) : (
            <>
              <AssignCollaboratorsForm
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
                      id: "litigation.litigation.cancelButton",
                    })}
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
                      id: "litigation.litigation.assignButton",
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
