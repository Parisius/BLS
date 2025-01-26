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
import { LitigationRoutes } from "@/config/routes";
import { useLitigationForm } from "@/lib/litigation/hooks";
import AddLitigationForm from "@/components/litigation/forms/add-litigation-form";
import { FormattedMessage } from "react-intl";

export default function AddLitigationDialog(props) {
  const formId = useId();
  const { form } = useLitigationForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      router.push(LitigationRoutes.litigationPage(id).index);
    },
    [router]
  );

  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="litigation.litigation.addLitigationDialog.title" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="litigation.litigation.addLitigationDialog.description" />
            </DialogDescription>
          </DialogHeader>
          <AddLitigationForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="litigation.litigation.addLitigationDialog.cancelButton" />
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
                <FormattedMessage id="litigation.litigation.addLitigationDialog.submitButton" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
