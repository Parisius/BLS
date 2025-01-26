"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUpdateLitigation } from "@/services/api-sdk/models/litigation/litigation";
import LitigationForm from "@/components/litigation/forms/litigation-form";
import { useIntl } from "react-intl";

export default function UpdateLitigationForm({
  formId,
  litigationId,
  className,
  onSuccess,
  onError,
}) {
  const { mutateAsync } = useUpdateLitigation(litigationId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.update.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.update.error",
            }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  return (
    <LitigationForm
      formId={formId}
      className={className}
      onSubmit={handleSubmit}
    />
  );
}
