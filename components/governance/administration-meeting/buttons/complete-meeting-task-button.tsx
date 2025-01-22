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
import { useMarkMeetingTaskAsCompleted } from "@/services/api-sdk/models/administration-meeting";
import { FormattedMessage } from "react-intl";
export default function CompleteMeetingTaskButton({ taskId, ...props }) {
  const form = useForm();
  const { mutateAsync } = useMarkMeetingTaskAsCompleted(taskId);
  const ref = useRef<HTMLButtonElement>(null);
  const handleComplete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        ref.current?.click();
        toast({
          description: "Tâche complétée avec succès !",
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description:
            "Une erreur est survenue lors de la complétion de la tâche.",
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync]);
  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleComplete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage id="sessionAdministrator.confirmTitle" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage id="sessionAdministrator.confirmDescription" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {" "}
              <FormattedMessage id="sessionAdministrator.cancel" />
            </AlertDialogCancel>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                <FormattedMessage id="sessionAdministrator.submit" />
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
