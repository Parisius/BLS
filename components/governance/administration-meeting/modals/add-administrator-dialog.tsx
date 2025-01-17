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
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useAddAdministratorForm } from "@/lib/governance/administration-meeting/hooks";
import AddAdministratorForm from "@/components/governance/administration-meeting/forms/add-administrator-form";
import { FormattedMessage } from "react-intl";
export default function AddAdministratorDialog(props) {
  const formId = useId();
  const form = useAddAdministratorForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="sessionAdministrator.add_administrator_dialog_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="sessionAdministrator.add_administrator_dialog_description" />
            </DialogDescription>
          </DialogHeader>
          <AddAdministratorForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="sessionAdministrator.add_administrator_dialog_cancel_button" />
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
                <FormattedMessage id="sessionAdministrator.add_administrator_dialog_add_button" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
