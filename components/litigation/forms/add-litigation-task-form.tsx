"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLitigationTaskForm } from "@/lib/litigation/hooks";
import { useCreateLitigationTask } from "@/services/api-sdk/models/litigation";
import LitigationTaskForm from "@/components/litigation/forms/litigation-task-form";
import { useIntl } from "react-intl";

export default function AddLitigationTaskForm({
  formId,
  litigationId,
  onSuccess,
  onError,
}) {
  const form = useLitigationTaskForm();
  const { mutateAsync } = useCreateLitigationTask(litigationId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.tasks.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.tasks.error",
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

  return <LitigationTaskForm formId={formId} onSubmit={handleSubmit} />;
}
