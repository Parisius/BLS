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
import { useDeleteMeetingTask } from "@/services/api-sdk/models/general-meeting";
import { FormattedMessage } from "react-intl";
export default function DeleteMeetingTaskButton({ taskId, ...props }) {
  const form = useForm();
  const { mutateAsync } = useDeleteMeetingTask(taskId);
  const ref = useRef(null);
  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: "Tâche supprimée avec succès !",
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description: "Une erreur est survenue lors de la suppression.",
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync]);
  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage id="generalMeeting.delete_task_modal_title" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage id="generalMeeting.delete_task_modal_description" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {" "}
              <FormattedMessage id="generalMeeting.delete_task_modal_cancel_delete_btn" />
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                <FormattedMessage id="generalMeeting.delete_task_modal_delete_btn" />
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
