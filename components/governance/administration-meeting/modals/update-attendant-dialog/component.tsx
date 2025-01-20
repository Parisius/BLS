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
import { useAttendantForm } from "@/lib/governance/administration-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneMeetingAttendant } from "@/services/api-sdk/models/administration-meeting";
import UpdateAttendantForm from "@/components/governance/administration-meeting/forms/update-attendant-form";
import { UpdateAttendantDialogSuspense } from "./suspense";
import { FormattedMessage } from "react-intl";
export function UpdateAttendantDialog({ attendantId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneMeetingAttendant(attendantId);
  const form = useAttendantForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (isError) {
    throw new Error("Failed to fetch meeting attendant");
  }
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {
    closeRef.current?.click();
  }, []);
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        name: data.name,
        grade: data.grade,
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
              <FormattedMessage id="sessionAdministrator.attendant_table_action_modify" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.update_attendant_dialog_description" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateAttendantDialogSuspense />
          ) : (
            <>
              <UpdateAttendantForm
                formId={formId}
                attendantId={attendantId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="sessionAdministrator.update_attendant_cancel_button" />
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
                    <FormattedMessage id="sessionAdministrator.update_attendant_cancel_button" />
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
