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
import { useStakeholderForm } from "@/lib/contract/hooks";
import AddStakeholderForm from "@/components/contract/forms/add-stakeholder-form";
import { useIntl } from "react-intl"; // Importez useIntl

export default function AddStakeholderDialog(props) {
  const formId = useId();
  const form = useStakeholderForm({
    noContext: true,
  });
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl(); // Utilisez le hook useIntl pour les traductions

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {
    // Gérer les erreurs si nécessaire
  }, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({
                id: "contract.contract.addStakeholder.dialog.title",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.addStakeholder.dialog.description",
              })}
            </DialogDescription>
          </DialogHeader>
          <AddStakeholderForm
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
                  id: "contract.contract.addStakeholder.dialog.cancel",
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
                  id: "contract.contract.addStakeholder.dialog.add",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
