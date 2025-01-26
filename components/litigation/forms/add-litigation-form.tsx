"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLitigationForm } from "@/lib/litigation/hooks";
import { useCreateLitigation } from "@/services/api-sdk/models/litigation/litigation";
import LitigationForm from "@/components/litigation/forms/litigation-form";
import { FormattedMessage, useIntl } from "react-intl";

export default function AddLitigationForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const { form } = useLitigationForm();
  const { mutateAsync } = useCreateLitigation();
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.addLitigationForm.successToast",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.addLitigationForm.errorToast",
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
    <LitigationForm
      formId={formId}
      className={className}
      onSubmit={handleSubmit}
    />
  );
}
