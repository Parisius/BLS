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
import { useTransferSharesForm } from "@/lib/governance/shareholding/hooks";
import TransferSharesForm from "@/components/governance/shareholding/forms/transfer-shares-form";
import { FormattedMessage } from "react-intl";

export default function TransferSharesDialog(props) {
  const formId = useId();
  const form = useTransferSharesForm();
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
              <FormattedMessage
                id="shareholding.transfer_shares_title"
                defaultMessage="New Share Transfer"
              />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage
                id="shareholding.transfer_shares_description"
                defaultMessage="Perform a share transfer."
              />
            </DialogDescription>
          </DialogHeader>
          <TransferSharesForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage
                  id="shareholding.transfer_shares_cancel"
                  defaultMessage="Cancel"
                />
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
                <FormattedMessage
                  id="shareholding.transfer_shares_submit"
                  defaultMessage="Transfer"
                />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
