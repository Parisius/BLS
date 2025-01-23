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
import { useDeleteDirector } from "@/services/api-sdk/models/management-committee/director";
import { FormattedMessage, useIntl } from "react-intl";

export default function DeleteDirectorButton({ directorId }) {
  const intl = useIntl();
  const form = useForm();
  const { mutateAsync } = useDeleteDirector(directorId);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "managementCommittee.deleteSuccess",
          }),
          className: "bg-primary text-primary-foreground",
        });
        closeRef.current?.click();
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "managementCommittee.deleteError",
          }),
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync, intl]);

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
          <FormattedMessage id="managementCommittee.deleteButton" />
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage id="managementCommittee.deleteConfirmationTitle" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage id="managementCommittee.deleteConfirmationDescription" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="sr-only" ref={closeRef} />
            <AlertDialogCancel type="button">
              <FormattedMessage id="managementCommittee.cancel" />
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                <FormattedMessage id="managementCommittee.deleteButton" />
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
