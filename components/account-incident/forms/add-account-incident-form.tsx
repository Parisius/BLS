"use client";

import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAccountIncidentForm } from "@/lib/account-incident/hooks";
import { useCreateAccountIncident } from "@/services/api-sdk/models/account-incident/account-incident";
import AccountIncidentForm from "@/components/account-incident/forms/account-incident-form";
import { useIntl } from "react-intl";

interface AddAccountIncidentFormProps {
  formId: string;
  className?: string;
  onSuccess?: (data: any) => void;
  onError?: () => void;
}

export default function AddAccountIncidentForm({
  formId,
  className,
  onSuccess,
  onError,
}: AddAccountIncidentFormProps) {
  const intl = useIntl();
  const form = useAccountIncidentForm();
  const { mutateAsync } = useCreateAccountIncident();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "incident.incident.form.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "incident.incident.form.error",
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
    <AccountIncidentForm
      formId={formId}
      className={className}
      onSubmit={handleSubmit}
    />
  );
}
