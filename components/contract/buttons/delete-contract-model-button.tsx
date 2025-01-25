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
import { useCallback } from "react";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { toast } from "@/components/ui/use-toast";
import { useDeleteContractModel } from "@/services/api-sdk/models/contract/contract-model";
import { useIntl } from "react-intl";

export default function DeleteContractModelButton({ modelId, ...props }) {
  const form = useForm();
  const { mutateAsync } = useDeleteContractModel(modelId);
  const intl = useIntl();

  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.deleteModel.success",
          }),
          className: "bg-primary text-primary-foreground",
        });
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.deleteModel.error",
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
                id: "contract.contract.deleteModel.title",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "contract.contract.deleteModel.description",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">
              {intl.formatMessage({
                id: "contract.contract.deleteModel.cancel",
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
                  id: "contract.contract.deleteModel.delete",
                })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
