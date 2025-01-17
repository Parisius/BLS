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
import { useDeleteAdministrator } from "@/services/api-sdk/models/administration-meeting/administrator";
import { FormattedMessage } from "react-intl";
export default function DeleteAdministratorButton({ administratorId }) {
  const form = useForm();
  const { mutateAsync } = useDeleteAdministrator(administratorId);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: "Administrateur supprimé avec succès.",
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
          <FormattedMessage id="sessionAdministrator.delete_administrator_button_tooltip" />
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage id="sessionAdministrator.delete_administrator_button_title" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage id="sessionAdministrator.delete_administrator_button_description" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="sr-only" ref={closeRef} />
            <AlertDialogCancel type="button">
              <FormattedMessage id="sessionAdministrator.delete_administrator_button_cancel" />
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                <FormattedMessage id="sessionAdministrator.delete_administrator_button_confirm" />
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
