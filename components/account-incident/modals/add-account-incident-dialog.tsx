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
import { AccountIncidentRoutes } from "@/config/routes";
import { useAccountIncidentForm } from "@/lib/account-incident/hooks";
import AddAccountIncidentForm from "@/components/account-incident/forms/add-account-incident-form";
import ConfirmAccountIncidentCreationModal from "@/components/account-incident/modals/confirm-account-incident-creation-modal";
import { useIntl } from "react-intl";

export default function AddAccountIncidentDialog(props) {
  const intl = useIntl();
  const formId = useId();
  const form = useAccountIncidentForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeConfirmRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      closeConfirmRef.current?.click();
      router.push(AccountIncidentRoutes.accountIncidentPage(id).index);
    },
    [router]
  );

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({ id: "incident.incident.dialog.title" })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "incident.incident.dialog.description",
              })}
            </DialogDescription>
          </DialogHeader>
          <AddAccountIncidentForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                {intl.formatMessage({
                  id: "incident.incident.dialog.cancelButton",
                })}
              </Button>
            </DialogClose>
            <ConfirmAccountIncidentCreationModal
              asChild
              formId={formId}
              isSubmitting={form.formState.isSubmitting}
              cancelButtonRef={closeConfirmRef}
            >
              <Button>
                {intl.formatMessage({
                  id: "incident.incident.dialog.submitButton",
                })}
              </Button>
            </ConfirmAccountIncidentCreationModal>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
