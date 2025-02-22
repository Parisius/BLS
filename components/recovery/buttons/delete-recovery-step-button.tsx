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
import { useDeleteRecoveryStep } from "@/services/api-sdk/models/recovery";
import { useIntl } from "react-intl";

export default function DeleteRecoveryStepButton({ stepId, ...props }) {
  const intl = useIntl();
  const form = useForm();
  const { mutateAsync } = useDeleteRecoveryStep(stepId);
  const ref = useRef(null);

  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "recovery.taskDeletedSuccess",
          }),
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description: intl.formatMessage({ id: "recovery.taskDeleteError" }),
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync, intl]);

  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({ id: "recovery.confirmDeleteTaskTitle" })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "recovery.confirmDeleteTaskDescription",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {intl.formatMessage({ id: "recovery.cancel" })}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                intl.formatMessage({ id: "recovery.delete" })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
