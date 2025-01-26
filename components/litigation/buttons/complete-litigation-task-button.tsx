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
import { useCompleteLitigationTask } from "@/services/api-sdk/models/litigation";
import { useIntl } from "react-intl";

export default function CompleteLitigationTaskButton({ taskId, ...props }) {
  const form = useForm();
  const { mutateAsync } = useCompleteLitigationTask(taskId);
  const ref = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

  const handleComplete = useCallback(async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "litigation.litigation.tasks.success",
          }),
          className: "bg-primary text-primary-foreground",
        });
        ref.current?.click();
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "litigation.litigation.tasks.error",
          }),
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
              {intl.formatMessage({
                id: "litigation.litigation.tasks.confirmTitle",
              })}{" "}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "litigation.litigation.tasks.confirmDescription",
              })}{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {intl.formatMessage({ id: "litigation.litigation.tasks.cancel" })}{" "}
            </AlertDialogCancel>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                intl.formatMessage({ id: "litigation.litigation.tasks.finish" })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
