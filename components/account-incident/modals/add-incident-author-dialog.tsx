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
import { useIncidentAuthorForm } from "@/lib/account-incident/hooks";
import AddIncidentAuthorForm from "@/components/account-incident/forms/add-incident-author-form";
import { useIntl } from "react-intl";

export default function AddIncidentAuthorDialog(props) {
  const intl = useIntl();
  const formId = useId();
  const form = useIncidentAuthorForm({
    noContext: true,
  });
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({
                id: "incident.incident.author.dialog.title",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "incident.incident.author.dialog.description",
              })}
            </DialogDescription>
          </DialogHeader>
          <AddIncidentAuthorForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                {intl.formatMessage({
                  id: "incident.incident.author.dialog.cancelButton",
                })}
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
                intl.formatMessage({
                  id: "incident.incident.author.dialog.addButton",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
