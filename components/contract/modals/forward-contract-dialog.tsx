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
import { useForwardContractForm } from "@/lib/contract/hooks";
import ForwardContractForm from "@/components/contract/forms/forward-contract-form";
import { useIntl } from "react-intl";

export default function ForwardContractDialog({ contractId, ...props }) {
  const formId = useId();
  const form = useForwardContractForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

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
                id: "contract.contract.forwardDialog.title",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.forwardDialog.description",
              })}
            </DialogDescription>
          </DialogHeader>
          <ForwardContractForm
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
                  id: "contract.contract.forwardDialog.cancel",
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
                  id: "contract.contract.forwardDialog.transfer",
                })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
