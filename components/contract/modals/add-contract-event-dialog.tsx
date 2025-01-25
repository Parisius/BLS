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
import { useContractEventForm } from "@/lib/contract/hooks";
import AddContractEventForm from "@/components/contract/forms/add-contract-event-form";
import { useIntl } from "react-intl";

export default function AddContractEventDialog({ contractId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const form = useContractEventForm();
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
              {intl.formatMessage({
                id: "contract.contract.events.newEventTitle",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.events.newEventDescription",
              })}
            </DialogDescription>
          </DialogHeader>
          <AddContractEventForm
            formId={formId}
            contractId={contractId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                {intl.formatMessage({
                  id: "contract.contract.events.cancelButton",
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
                intl.formatMessage({ id: "contract.contract.events.addButton" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
