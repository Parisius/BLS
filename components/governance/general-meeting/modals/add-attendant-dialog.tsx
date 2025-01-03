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
import { useAttendantForm } from "@/lib/governance/general-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import AddAttendantForm from "@/components/governance/general-meeting/forms/add-attendant-form";
import { FormattedMessage } from "react-intl";
export default function AddAttendantDialog({ meetingId, ...props }) {
  const formId = useId();
  const form = useAttendantForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage
                id="generalMeeting.general_meeting_add_attendants_title"
                defaultMessage="New Attendant"
              />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="generalMeeting.general_meeting_add_attendants_description" />
            </DialogDescription>
          </DialogHeader>
          <AddAttendantForm
            formId={formId}
            meetingId={meetingId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage
                  id="generalMeeting.general_meeting_add_attendants_cancel_btn"
                  defaultMessage="Annuler"
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
                  id="generalMeeting.general_meeting_add_attendants_add_btn"
                  defaultMessage="Add"
                />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
