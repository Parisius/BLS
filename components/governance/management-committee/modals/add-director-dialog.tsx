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
import { useAddDirectorForm } from "@/lib/governance/management-committee/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import AddDirectorForm from "@/components/governance/management-committee/forms/add-director-form";
import { FormattedMessage } from "react-intl";

export default function AddDirectorDialog(props) {
  const formId = useId();
  const form = useAddDirectorForm();
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
              <FormattedMessage id="managementCommittee.addDirectorTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="managementCommittee.addDirectorDescription" />
            </DialogDescription>
          </DialogHeader>

          <AddDirectorForm
            formId={formId}
            onSuccess={handleSuccess}
            onError={handleError}
          />

          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="managementCommittee.addDirectorCancel" />
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
                <FormattedMessage id="managementCommittee.addDirectorSubmit" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
