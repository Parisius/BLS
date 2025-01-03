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
import { BriefcaseBusiness, User } from "lucide-react";
import { useAttendantForm } from "@/lib/governance/general-meeting/hooks";
import { FormattedMessage, useIntl } from "react-intl";
export default function AttendantForm({ formId, onSubmit }) {
  const form = useAttendantForm();
  const intl = useIntl();

  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage
                  id="generalMeeting.general_meeting_add_attendants_name_input"
                  defaultMessage="First and Last Name"
                />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "generalMeeting.general_meeting_add_attendants_name_input",
                      defaultMessage: "First and Last Name",
                    })}
                    className="h-12 pl-10"
                  />
                  <User className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage
                  id="generalMeeting.general_meeting_add_attendants_type_input"
                  defaultMessage="Quality"
                />
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "generalMeeting.general_meeting_add_attendants_type_input",
                      defaultMessage: "Quality",
                    })}
                    className="h-12 pl-10 w-full"
                  />
                  <BriefcaseBusiness className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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
