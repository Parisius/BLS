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
import { useRouter } from "next13-progressbar";
import { useGeneralMeetingForm } from "@/lib/governance/general-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { GeneralMeetingRoutes } from "@/config/routes";
import AddGeneralMeetingForm from "@/components/governance/general-meeting/forms/add-general-meeting-form";
import { FormattedMessage } from "react-intl";
export default function AddGeneralMeetingDialog(props) {
  const formId = useId();
  const form = useGeneralMeetingForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      router.push(GeneralMeetingRoutes.session(id).index);
    },
    [router]
  );
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="generalMeeting.add_general_meeting_modal_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="generalMeeting.add_general_meeting_modal_description" />
            </DialogDescription>
          </DialogHeader>
          <AddGeneralMeetingForm formId={formId} onSuccess={handleSuccess} />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="generalMeeting.add_general_meeting_modal_cancel_btn" />
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
                <FormattedMessage id="generalMeeting.add_general_meeting_modal_validation_btn" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
