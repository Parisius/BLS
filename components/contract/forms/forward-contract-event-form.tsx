"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useForwardContractEvent } from "@/services/api-sdk/models/contract/contract-event";
import { useForwardContractEventForm } from "@/lib/contract/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import { Textarea } from "@/components/ui/textarea";
import UserSelect from "@/components/contract/inputs/user-select";
import { useIntl } from "react-intl";

export default function ForwardContractEventForm({
  formId,
  eventId,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useForwardContractEventForm();
  const { mutateAsync } = useForwardContractEvent(eventId);

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.events.forwardSuccess",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.events.forwardError",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: "contract.contract.events.subject" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.events.subjectPlaceholder",
                    })}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: "contract.contract.events.dueDate" })}
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

        <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.events.receiver",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <UserSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: "contract.contract.events.notes" })}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  placeholder={intl.formatMessage({
                    id: "contract.contract.events.notesPlaceholder",
                  })}
                  className="resize-none"
                  rows={5}
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
