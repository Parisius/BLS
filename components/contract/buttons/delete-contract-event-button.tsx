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
import { useDeleteContractEvent } from "@/services/api-sdk/models/contract/contract-event";
import { useIntl } from "react-intl";

export default function DeleteContractEventButton({ eventId, ...props }) {
  const intl = useIntl();
  const form = useForm();
  const { mutateAsync } = useDeleteContractEvent(eventId);
  const ref = useRef(null);

  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.events.deleteSuccess",
          }),
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.events.deleteError",
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
                id: "contract.contract.events.confirmDeleteTitle",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "contract.contract.events.confirmDeleteDescription",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={ref} className="sr-only" />
            <AlertDialogCancel type="button">
              {intl.formatMessage({
                id: "contract.contract.events.cancelButton",
              })}
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
                  id: "contract.contract.events.deleteButton",
                })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
