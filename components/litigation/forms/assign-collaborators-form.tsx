"use client";
import { Form } from "@/components/ui/form";
import { useAssignCollaboratorsForm } from "@/lib/litigation/hooks";
import { cn } from "@/lib/utils";
import UsersSectionForm from "@/components/litigation/forms/users-section-form";
import LawyersSectionForm from "@/components/litigation/forms/lawyers-section-form";
import { useAssignCollaborators } from "@/services/api-sdk/models/litigation/litigation";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useIntl } from "react-intl";

export default function AssignCollaboratorsForm({
  formId,
  litigationId,
  className,
  onSuccess,
  onError,
}) {
  const { form, usersArray, lawyersArray } = useAssignCollaboratorsForm();
  const { mutateAsync } = useAssignCollaborators(litigationId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(
        {
          users: data.users.map(({ id }) => id),
          lawyers: data.lawyers.map(({ id }) => id),
        },
        {
          onSuccess: () => {
            toast({
              description: intl.formatMessage({
                id: "litigation.litigation.assignCollaboratorsSuccess",
              }),
              className: "bg-primary text-primary-foreground",
            });
            onSuccess?.();
          },
          onError: () => {
            toast({
              description: intl.formatMessage({
                id: "litigation.litigation.assignCollaboratorsError",
              }),
              className: "bg-destructive text-destructive-foreground",
            });
            onError?.();
          },
        }
      );
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UsersSectionForm
          label={intl.formatMessage({ id: "litigation.collaboratorsLabel" })}
          fieldName="users"
          form={form}
          fieldArray={usersArray}
        />

        <LawyersSectionForm
          label={intl.formatMessage({ id: "litigation.lawyersLabel" })}
          fieldName="lawyers"
          form={form}
          fieldArray={lawyersArray}
        />
      </form>
    </Form>
  );
}
