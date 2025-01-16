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
import { useGeneralMeetingForm } from "@/lib/governance/general-meeting/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormattedMessage, useIntl } from "react-intl";
import { getMeetingTypes } from "@/services/api-sdk/types/general-meeting";

export default function GeneralMeetingForm({ formId, onSubmit }) {
  const form = useGeneralMeetingForm();
  const intl = useIntl();
  const localizedMeetingTypes = getMeetingTypes(intl);

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
                <FormattedMessage id="generalMeeting.add_general_meeting_form_name_field" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "generalMeeting.add_general_meeting_form_name_field",
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
                <FormattedMessage id="generalMeeting.add_general_meeting_form_type_field" />
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue
                      placeholder={intl.formatMessage({
                        id: "generalMeeting.add_general_meeting_form_type_field",
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {localizedMeetingTypes.map((type) => (
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
                <FormattedMessage id="generalMeeting.add_general_meeting_form_date_field" />
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
