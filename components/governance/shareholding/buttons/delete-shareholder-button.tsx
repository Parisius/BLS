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
import { useDeleteShareholder } from "@/services/api-sdk/models/shareholding";
import { FormattedMessage } from "react-intl";

interface DeleteShareholderButtonProps {
  shareholderId: string;
  onSuccess?: () => void;
}

export default function DeleteShareholderButton({
  shareholderId,
  onSuccess,
}: DeleteShareholderButtonProps) {
  const form = useForm();
  const { mutateAsync } = useDeleteShareholder(shareholderId);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: "Actionnaire supprimé avec succès.",
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
            id="delete_shareholder_tooltip"
            defaultMessage="Delete"
          />
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage id="shareholding.delete_shareholder_confirm_title" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <FormattedMessage id="shareholding.delete_shareholder_confirm_description" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="sr-only" ref={closeRef} />
            <AlertDialogCancel type="button">
              <FormattedMessage
                id="shareholding.delete_shareholder_cancel"
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
                  id="shareholding.delete_shareholder_submit"
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
