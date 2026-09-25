"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EmailListInput } from "@/components/shared/email-list-input";
import { useDictionary } from "@/lib/i18n/locale-provider";

export interface MailFieldValues {
  actionType: "archive" | "transfer_mail";
  mail: { recipient: "admin" | "personnel"; subject: string; content: string; addresses: string[] };
}

/** The "what to do with this item" field, and the mail composer shown when it is sent by mail. */
export function ActionField({ control }: { control: Control<MailFieldValues> }) {
  const { t } = useDictionary();
  const tm = t.legalMonitoring.mailForm;
  const items = [
    { value: "archive", label: t.legalMonitoring.actions.archive },
    { value: "transfer_mail", label: t.legalMonitoring.actions.transferMail },
  ];

  return (
    <FormField
      control={control}
      name="actionType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{tm.action}</FormLabel>
          <Select value={field.value} items={items} onValueChange={(next) => field.onChange(next ?? "")}>
            <FormControl>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder={tm.selectAction} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function MailFields({ control }: { control: Control<MailFieldValues> }) {
  const { t } = useDictionary();
  const tm = t.legalMonitoring.mailForm;
  const recipients = [
    { value: "personnel", label: t.legalMonitoring.recipients.personnel },
    { value: "admin", label: t.legalMonitoring.recipients.admin },
  ];

  return (
    <>
      <Separator className="col-span-full my-2" />
      <FormField
        control={control}
        name="mail.recipient"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{tm.recipient}</FormLabel>
            <Select value={field.value} items={recipients} onValueChange={(next) => field.onChange(next ?? "")}>
              <FormControl>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder={tm.recipient} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {recipients.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mail.addresses"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{tm.addresses}</FormLabel>
            <EmailListInput
              value={field.value}
              onChange={field.onChange}
              placeholder={tm.addressesPlaceholder}
              invalidLabel={tm.addressInvalid}
              removeLabel={tm.removeAddress}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mail.subject"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{tm.subject}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={tm.subject} className="h-12" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mail.content"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{tm.message}</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder={tm.message} className="resize-none" rows={5} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
