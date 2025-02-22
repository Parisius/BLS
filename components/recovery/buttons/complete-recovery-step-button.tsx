"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useCallback, useRef } from "react";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { toast } from "@/components/ui/use-toast";
import { useCompleteRecoveryStep } from "@/services/api-sdk/models/recovery";
import { useIntl } from "react-intl";

export default function CompleteRecoveryStepButton({ stepId, ...props }) {
  const intl = useIntl();
  const form = useForm();
  const { mutateAsync } = useCompleteRecoveryStep(stepId);
  const ref = useRef<HTMLButtonElement>(null);

  const handleComplete = useCallback(async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "recovery.completeStepSuccess",
          }),
          className: "bg-primary text-primary-foreground",
        });
        ref.current?.click();
      },
      onError: () => {
        toast({
          description: intl.formatMessage({ id: "recovery.completeStepError" }),
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync, intl]);

  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleComplete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({ id: "recovery.confirmCompleteStepTitle" })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "recovery.confirmCompleteStepDescription",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {intl.formatMessage({ id: "recovery.cancel" })}
            </AlertDialogCancel>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                intl.formatMessage({ id: "recovery.finish" })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
