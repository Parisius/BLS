"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useIncidentAuthorForm } from "@/lib/account-incident/hooks";
import { useCreateIncidentAuthor } from "@/services/api-sdk/models/account-incident";
import IncidentAuthorForm from "@/components/account-incident/forms/incident-author-form";
import { useIntl } from "react-intl";

export default function AddIncidentAuthorForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useIncidentAuthorForm();
  const { mutateAsync } = useCreateIncidentAuthor();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "incident.incident.author.form.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "incident.incident.author.form.error",
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
    <IncidentAuthorForm
      formId={formId}
      className={className}
      onSubmit={handleSubmit}
    />
  );
}
