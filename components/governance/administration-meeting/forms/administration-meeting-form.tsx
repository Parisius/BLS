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
import { DateInput } from "@/components/ui/date-input";
import { useAdministrationMeetingForm } from "@/lib/governance/administration-meeting/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  boardMeetingTypes,
  meetingTypes,
} from "@/services/api-sdk/types/administration-meeting";
import { FormattedMessage, useIntl } from "react-intl";
export default function AdministrationMeetingForm({ formId, onSubmit }) {
  const form = useAdministrationMeetingForm();
  const intl = useIntl();
  const translatedMeetingTypes = boardMeetingTypes.map((type) => ({
    ...type,
    label: intl.formatMessage({
      id: `sessionAdministrator.meeting.type.${type.value}`,
    }),
  }));
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
                <FormattedMessage id="sessionAdministrator.add_meeting_dialog_form_meeting_title_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "sessionAdministrator.add_meeting_dialog_form_meeting_title_label",
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
          name="meetingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {" "}
                <FormattedMessage id="sessionAdministrator.add_meeting_dialog_form_meeting_title_label" />
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Type du CA" />
                  </SelectTrigger>
                  <SelectContent>
                    {translatedMeetingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {" "}
                <FormattedMessage id="sessionAdministrator.add_meeting_dialog_form_meeting_date_label" />
              </FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  className="h-12"
                  onChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                  minDate={new Date()}
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
