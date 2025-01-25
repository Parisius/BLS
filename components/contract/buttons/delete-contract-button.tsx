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
import { useDeleteContract } from "@/services/api-sdk/models/contract/contract";
import { useRouter } from "next13-progressbar";
import { ContractRoutes } from "@/config/routes";
import { useIntl } from "react-intl";

export default function DeleteContractButton({ contractId }) {
  const form = useForm();
  const { mutateAsync } = useDeleteContract(contractId);
  const router = useRouter();
  const intl = useIntl();

  const handleDelete = useCallback(async () => {
    await mutateAsync({
      onSuccess: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.deleteButton.success",
          }),
          className: "bg-primary text-primary-foreground",
        });
        router.push(ContractRoutes.contractsList);
      },
      onError: () => {
        toast({
          description: intl.formatMessage({
            id: "contract.contract.deleteButton.error",
          }),
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync, router, intl]);

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
              <Trash />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>
          {intl.formatMessage({ id: "contract.contract.deleteButton.tooltip" })}
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleDelete)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({
                id: "contract.contract.deleteButton.title",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({
                id: "contract.contract.deleteButton.description",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">
              {intl.formatMessage({
                id: "contract.contract.deleteButton.cancel",
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
                  id: "contract.contract.deleteButton.delete",
                })
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
