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
import { useForwardContractEventForm } from "@/lib/contract/hooks";
import ForwardContractEventForm from "@/components/contract/forms/forward-contract-event-form";
import { useIntl } from "react-intl";

export default function ForwardContractEventDialog({ eventId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const form = useForwardContractEventForm();
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
                id: "contract.contract.events.forwardTitle",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.events.forwardDescription",
              })}
            </DialogDescription>
          </DialogHeader>
          <ForwardContractEventForm
            formId={formId}
            eventId={eventId}
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
                intl.formatMessage({
                  id: "contract.contract.events.transferButton",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
