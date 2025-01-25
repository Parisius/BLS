"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCompleteContract } from "@/services/api-sdk/models/contract/contract";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import DocumentsForm from "@/components/ui/documents-form";
import { useCompleteContractForm } from "@/lib/contract/hooks";
import { useIntl } from "react-intl";

export default function CompleteContractForm({
  formId,
  contractId,
  transferId,
  className,
  onSuccess,
  onError,
}) {
  const { form, filesArray } = useCompleteContractForm();
  const { mutateAsync } = useCompleteContract(contractId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(
        { transferId, ...data },
        {
          onSuccess: () => {
            toast({
              description: intl.formatMessage({
                id: "contract.contract.success",
              }),
              className: "bg-primary text-primary-foreground",
            });
            onSuccess?.();
          },
          onError: () => {
            toast({
              description: intl.formatMessage({
                id: "contract.contract.error",
              }),
              className: "bg-destructive text-destructive-foreground",
            });
            onError?.();
          },
        }
      );
    },
    [mutateAsync, onError, onSuccess, transferId, intl]
  );

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <DocumentsForm
          label={intl.formatMessage({ id: "contract.contract.documents" })}
          fieldName="files"
          form={form}
          fieldArray={filesArray}
          className="col-span-2"
        />
      </form>
    </Form>
  );
}
