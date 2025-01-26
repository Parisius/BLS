"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUpdateLitigationTask } from "@/services/api-sdk/models/litigation";
import LitigationTaskForm from "@/components/litigation/forms/litigation-task-form";
import { useIntl } from "react-intl";

export default function UpdateLitigationTaskForm({
  formId,
  taskId,
  onSuccess,
  onError,
}) {
  const { mutateAsync } = useUpdateLitigationTask(taskId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.tasks.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
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

  return <LitigationTaskForm formId={formId} onSubmit={handleSubmit} />;
}
