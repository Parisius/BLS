"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRecoveryStepForm } from "@/lib/recovery/hooks";
import { useCreateRecoveryStep } from "@/services/api-sdk/models/recovery";
import RecoveryStepForm from "@/components/recovery/forms/recovery-step-form";
import { useIntl } from "react-intl";

export default function AddRecoveryStepForm({
  formId,
  recoveryId,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useRecoveryStepForm();
  const { mutateAsync } = useCreateRecoveryStep(recoveryId);

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "recovery.taskPlannedSuccess",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "recovery.taskPlanningError",
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

  return <RecoveryStepForm formId={formId} onSubmit={handleSubmit} />;
}
