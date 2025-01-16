"use client";
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
import { useChecklistTaskForm } from "@/lib/governance/general-meeting/hooks";
import { FormattedMessage, useIntl } from "react-intl";
export default function ChecklistTaskForm({ formId, onSubmit }) {
  const intl = useIntl();
  const form = useChecklistTaskForm();
  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="generalMeeting.edit_task_modal_input_title" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "generalMeeting.edit_task_modal_input_title",
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
      </form>
    </Form>
  );
}
