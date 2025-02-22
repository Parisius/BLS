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
import { useRouter } from "next13-progressbar";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { RecoveryRoutes } from "@/config/routes";
import { useRecoveryForm } from "@/lib/recovery/hooks";
import AddRecoveryForm from "@/components/recovery/forms/add-recovery-form";
import { FormattedMessage } from "react-intl";

export default function AddRecoveryDialog(props) {
  const formId = useId();
  const form = useRecoveryForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      router.push(RecoveryRoutes.recoveryPage(id).index);
    },
    [router]
  );

  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="recovery.newRecovery" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="recovery.initiateNewRecoveryDescription" />
            </DialogDescription>
          </DialogHeader>
          <AddRecoveryForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="recovery.cancel" />
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
                <FormattedMessage id="recovery.initiate" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
