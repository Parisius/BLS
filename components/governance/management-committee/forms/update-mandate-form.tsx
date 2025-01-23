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
import { useUpdateMandate } from "@/services/api-sdk/models/management-committee";
import { useUpdateMandateForm } from "@/lib/governance/management-committee/hooks";
import { FormattedMessage, useIntl } from "react-intl";

export default function UpdateMandateForm({
  formId,
  mandateId,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useUpdateMandateForm();
  const { mutateAsync } = useUpdateMandate(mandateId);

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: intl.formatMessage({
              id: "managementCommittee.updateMandateSuccess",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "managementCommittee.updateMandateError",
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
                <FormattedMessage id="managementCommittee.startDateLabel" />
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
