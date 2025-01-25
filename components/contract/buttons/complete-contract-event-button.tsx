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
import { useMarkContractEventAsCompleted } from "@/services/api-sdk/models/contract/contract-event";
import { useIntl } from "react-intl";

export default function CompleteContractEventButton({ eventId, ...props }) {
  const intl = useIntl();
  const form = useForm();
  const { mutateAsync } = useMarkContractEventAsCompleted(eventId);
  const ref = useRef<HTMLButtonElement>(null);

  const handleComplete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        ref.current?.click();
        toast({
          description: intl.formatMessage({
            id: "contract.contract.events.completeSuccess",
          }),
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.events.completeError",
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
                id: "contract.contract.events.confirmTitle",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "contract.contract.events.confirmDescription",
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <EllipsisLoader />
              ) : (
                intl.formatMessage({
                  id: "contract.contract.events.completeButton",
                })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
