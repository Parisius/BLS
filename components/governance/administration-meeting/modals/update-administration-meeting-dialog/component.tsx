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
import { useAdministrationMeetingForm } from "@/lib/governance/administration-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneAdministrationMeeting } from "@/services/api-sdk/models/administration-meeting";
import UpdateAdministrationMeetingForm from "@/components/governance/administration-meeting/forms/update-administration-meeting-form";
import { UpdateAdministrationMeetingDialogSuspense } from "./suspense";
import { FormattedMessage } from "react-intl";
export function UpdateAdministrationMeetingDialog({ meetingId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneAdministrationMeeting(meetingId);
  const form = useAdministrationMeetingForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (isError) {
    throw new Error("Failed to fetch administration meeting");
  }
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        meetingType: data.meetingType,
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
              <FormattedMessage id="sessionAdministrator.edit_ca_dialog_title_edit" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.edit_ca_dialog_description_edit" />
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateAdministrationMeetingDialogSuspense />
          ) : (
            <>
              <UpdateAdministrationMeetingForm
                formId={formId}
                meetingId={meetingId}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    <FormattedMessage id="sessionAdministrator.edit_ca_button_cancel" />
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
                    <FormattedMessage id="sessionAdministrator.edit_ca_button_edit" />
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
