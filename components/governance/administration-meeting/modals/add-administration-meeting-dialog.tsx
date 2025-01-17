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
import { useAdministrationMeetingForm } from "@/lib/governance/administration-meeting/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { AdministrationMeetingRoutes } from "@/config/routes";
import AddAdministrationMeetingForm from "@/components/governance/administration-meeting/forms/add-administration-meeting-form";
import { FormattedMessage } from "react-intl";
export default function AddAdministrationMeetingDialog(props) {
  const formId = useId();
  const form = useAdministrationMeetingForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      router.push(AdministrationMeetingRoutes.session(id).index);
    },
    [router]
  );
  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="sessionAdministrator.add_meeting_dialog_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.add_meeting_dialog_description" />
            </DialogDescription>
          </DialogHeader>
          <AddAdministrationMeetingForm
            formId={formId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="sessionAdministrator.add_meeting_dialog_cancel_button" />
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
                <FormattedMessage id="sessionAdministrator.add_meeting_dialog_schedule_button" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
