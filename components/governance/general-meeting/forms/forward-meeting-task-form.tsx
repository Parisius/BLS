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
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import { Textarea } from "@/components/ui/textarea";
import { useForwardMeetingTaskForm } from "@/lib/governance/general-meeting/hooks";
import { useForwardMeetingTask } from "@/services/api-sdk/models/general-meeting";
import UserSelect from "@/components/governance/general-meeting/inputs/user-select";
import { FormattedMessage, useIntl } from "react-intl";
export default function ForwardMeetingTaskForm({
  formId,
  taskId,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useForwardMeetingTaskForm();
  const { mutateAsync } = useForwardMeetingTask(taskId);
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: "Tâche transférée avec succès",
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
        },
        onError: () => {
          toast({
            description:
              "Une erreur est survenue lors du transfert de la tâche",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="generalMeeting.share_task_modal_object_input" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "generalMeeting.share_task_modal_object_input",
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
                <FormattedMessage id="generalMeeting.share_task_modal_date_input" />
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
                <FormattedMessage id="generalMeeting.share_task_modal_recever_input" />
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
                <FormattedMessage id="generalMeeting.share_task_modal_observations_input" />
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  placeholder={intl.formatMessage({
                    id: "generalMeeting.share_task_modal_observations_input",
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
