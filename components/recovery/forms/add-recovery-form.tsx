"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCreateRecovery } from "@/services/api-sdk/models/recovery/recovery";
import RecoveryForm from "@/components/recovery/forms/recovery-form";
import { useRecoveryForm } from "@/lib/recovery/hooks";
import { useIntl } from "react-intl";

export default function AddRecoveryForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useRecoveryForm();
  const { mutateAsync } = useCreateRecovery();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({ id: "recovery.recoverySuccess" }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({ id: "recovery.recoveryError" }),
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
    <RecoveryForm
      formId={formId}
      className={className}
      onSubmit={handleSubmit}
    />
  );
}
