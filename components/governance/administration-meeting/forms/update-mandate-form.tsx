"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateInput } from "@/components/ui/date-input";
import { useUpdateMandate } from "@/services/api-sdk/models/administration-meeting";
import { useUpdateMandateForm } from "@/lib/governance/administration-meeting/hooks";
import { FormattedMessage } from "react-intl";
export default function UpdateMandateForm({
  formId,
  mandateId,
  onSuccess,
  onError,
}) {
  const form = useUpdateMandateForm();
  const { mutateAsync } = useUpdateMandate(mandateId);
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: "Mandat mis à jour avec succès",
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
        },
        onError: () => {
          toast({
            description:
              "Une erreur est survenue lors de la mise à jour du mandat",
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess]
  );
  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_mandate_form_start_date_label" />
              </FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  className="h-12"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
