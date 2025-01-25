"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useContractEventForm } from "@/lib/contract/hooks";
import { useCreateContractEvent } from "@/services/api-sdk/models/contract/contract-event";
import ContractEventForm from "@/components/contract/forms/contract-event-form";
import { useIntl } from "react-intl";

export default function AddContractEventForm({
  formId,
  contractId,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useContractEventForm();
  const { mutateAsync } = useCreateContractEvent(contractId);

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.events.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.events.error",
            }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);

  return <ContractEventForm formId={formId} onSubmit={handleSubmit} />;
}
