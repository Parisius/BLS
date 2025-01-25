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
import React, { useCallback, useEffect, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneContractEvent } from "@/services/api-sdk/models/contract/contract-event";
import { useContractEventForm } from "@/lib/contract/hooks";
import UpdateContractEventForm from "@/components/contract/forms/update-contract-event-form";
import { UpdateContractEventDialogSuspense } from "./suspense";
import { useIntl } from "react-intl";

export function UpdateContractEventDialog({ eventId, ...props }) {
  const intl = useIntl();
  const formId = useId();
  const { data, isLoading, isError } = useOneContractEvent(eventId);
  const form = useContractEventForm();
  const closeRef = useRef<HTMLButtonElement>(null);

  if (isError) {
    throw new Error("Failed to fetch contract event");
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        dueDate: data.dueDate,
      });
    }
  }, [data, form, isLoading]);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({
                id: "contract.contract.events.updateTitle",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.events.updateDescription",
              })}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateContractEventDialogSuspense />
          ) : (
            <>
              <UpdateContractEventForm
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
                      id: "contract.contract.events.updateButton",
                    })
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
