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
import { useCallback, useRef } from "react";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { toast } from "@/components/ui/use-toast";
import { useDeleteMeetingAttendant } from "@/services/api-sdk/models/general-meeting";
import { FormattedMessage } from "react-intl";
export default function DeleteAttendantButton({ attendantId }) {
  const form = useForm();
  const { mutateAsync } = useDeleteMeetingAttendant(attendantId);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: "Participant supprimé avec succès !",
          className: "bg-primary text-primary-foreground",
        });
        closeRef.current?.click();
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
          <FormattedMessage
            id="generalMeeting.general_meeting_attendants_table_actions_delete"
            defaultMessage="Delete"
          />
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage
                id="generalMeeting.general_meeting_delete_attendants_title"
                defaultMessage="Êtes-vous sûr de vouloir supprimer ce participant ?"
              />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage
                id="generalMeeting.general_meeting_delete_attendants_description"
                defaultMessage="Cette action est irréversible."
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={closeRef} className="sr-only" />
            <AlertDialogCancel type="button">
              <FormattedMessage
                id="generalMeeting.general_meeting_add_attendants_cancel_btn"
                defaultMessage="Cancel"
              />
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                <FormattedMessage
                  id="generalMeeting.general_meeting_attendants_table_actions_delete"
                  defaultMessage="Delete"
                />
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
