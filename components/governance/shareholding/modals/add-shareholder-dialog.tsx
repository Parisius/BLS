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
import { useShareholderForm } from "@/lib/governance/shareholding/hooks";
import AddShareholderForm from "@/components/governance/shareholding/forms/add-shareholder-form";
import { FormattedMessage } from "react-intl";
export default function AddShareholderDialog(props) {
  const formId = useId();
  const form = useShareholderForm();
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
              <FormattedMessage id="shareholding.add_shareholder_dialog_title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="shareholding.add_shareholder_dialog_description" />
            </DialogDescription>
          </DialogHeader>
          <AddShareholderForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="shareholding.add_shareholder_button_cancel" />
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
                <FormattedMessage id="shareholding.add_shareholder_button_add" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
