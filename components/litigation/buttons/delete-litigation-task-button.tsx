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
import { useDeleteLitigationTask } from "@/services/api-sdk/models/litigation";
import { useIntl } from "react-intl";

export default function DeleteLitigationTaskButton({ taskId, ...props }) {
  const form = useForm();
  const { mutateAsync } = useDeleteLitigationTask(taskId);
  const ref = useRef(null);
  const intl = useIntl();

  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "litigation.litigation.delete.tasks.success",
          }),
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "litigation.litigation.delete.tasks.error",
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
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({
                id: "litigation.litigation.delete.tasks.confirmTitle",
              })}{" "}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "litigation.tasks.confirmDescription",
              })}{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {intl.formatMessage({
                id: "litigation.litigation.delete.tasks.cancel",
              })}{" "}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                intl.formatMessage({
                  id: "litigation.litigation.delete.tasks.delete",
                })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
