"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUpdateRecoveryStep } from "@/services/api-sdk/models/recovery";
import RecoveryStepForm from "@/components/recovery/forms/recovery-step-form";
import { useIntl } from "react-intl";

export default function UpdateRecoveryStepForm({
  formId,
  stepId,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const { mutateAsync } = useUpdateRecoveryStep(stepId);

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: intl.formatMessage({
              id: "recovery.taskUpdatedSuccess",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({ id: "recovery.taskUpdateError" }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  return <RecoveryStepForm formId={formId} onSubmit={handleSubmit} />;
}
