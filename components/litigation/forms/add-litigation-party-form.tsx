"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLitigationPartyForm } from "@/lib/litigation/hooks";
import { useCreateLitigationParty } from "@/services/api-sdk/models/litigation/litigation-party";
import LitigationPartyForm from "@/components/litigation/forms/litigation-party-form";
import { useIntl } from "react-intl";

export default function AddLitigationPartyForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useLitigationPartyForm();
  const { mutateAsync } = useCreateLitigationParty();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "litigation.addLitigationPartyForm.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "litigation.addLitigationPartyForm.error",
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

  return (
    <LitigationPartyForm
      formId={formId}
      className={className}
      onSubmit={handleSubmit}
    />
  );
}
