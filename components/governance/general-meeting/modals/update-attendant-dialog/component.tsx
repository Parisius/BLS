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
import { useAttendantForm } from "@/lib/governance/general-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneMeetingAttendant } from "@/services/api-sdk/models/general-meeting";
import UpdateAttendantForm from "@/components/governance/general-meeting/forms/update-attendant-form";
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
  const handleError = useCallback(() => {}, []);
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
              <FormattedMessage id="generalMeeting.general_meeting_modify_attendants_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="generalMeeting.general_meeting_modify_attendants_description" />
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
                    <FormattedMessage
                      id="generalMeeting.general_meeting_add_attendants_cancel_btn"
                      defaultMessage="Cancel"
                    />
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
                    <FormattedMessage
                      id="generalMeeting.general_meeting_attendants_table_actions_modify"
                      defaultMessage="Modify"
                    />
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
