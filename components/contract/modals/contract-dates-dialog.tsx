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
import { useContractDatesForm } from "@/lib/contract/hooks/use-contract-dates-form";
import ContractDatesForm from "@/components/contract/forms/contract-dates-form";
import { useIntl } from "react-intl"; // Import du hook useIntl

export default function ContractDatesDialog({
  contractId,
  dateType,
  defaultDate,
  ...props
}) {
  const intl = useIntl(); // Utilisation du hook useIntl
  const formId = useId();
  const form = useContractDatesForm(dateType);
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
              {intl.formatMessage({ id: "contract.contract.dates.title" })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.dates.description",
              })}
            </DialogDescription>
          </DialogHeader>
          <ContractDatesForm
            dateType={dateType}
            contractId={contractId}
            defaultDate={defaultDate}
            formId={formId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                {intl.formatMessage({
                  id: "contract.contract.dates.cancelButton",
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
                  id: "contract.contract.dates.scheduleButton",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
