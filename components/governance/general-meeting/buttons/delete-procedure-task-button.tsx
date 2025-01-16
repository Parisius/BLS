"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
import { useCallback } from "react";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { toast } from "@/components/ui/use-toast";
import { useDeleteMeetingProcedureTask } from "@/services/api-sdk/models/general-meeting";
import { FormattedMessage } from "react-intl";
export default function DeleteProcedureTaskButton({ taskId }) {
  const form = useForm();
  const { mutateAsync } = useDeleteMeetingProcedureTask(taskId);
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
      <Tooltip>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full bg-accent text-destructive"
            >
              <Trash size={16} />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>
          {" "}
          <FormattedMessage id="generalMeeting.delete_task_btn" />
        </TooltipContent>
      </Tooltip>
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
