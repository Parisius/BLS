"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PARTY_ENTITY_TYPES } from "@/lib/litigation/constants";
import type { PartyFormValues } from "@/lib/litigation/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { UseFormReturn } from "react-hook-form";

export function PartyForm({
  formId,
  form,
  onSubmit,
}: {
  formId: string;
  form: UseFormReturn<PartyFormValues>;
  onSubmit: (values: PartyFormValues) => void | Promise<void>;
}) {
  const { t } = useDictionary();
  const tp = t.litigation.litigationPartyForm;
  const type = form.watch("type");
  const isLegal = type === "legal";

  return (
    <Form {...form}>
      <form id={formId} noValidate className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tp.type}</FormLabel>
              <Select
                value={field.value}
                onValueChange={(next) => field.onChange(next ?? "")}
                items={PARTY_ENTITY_TYPES.map((value) => ({ value, label: t.litigation.partyEntityTypes[value] }))}
              >
                <FormControl>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder={tp.selectType} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PARTY_ENTITY_TYPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t.litigation.partyEntityTypes[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {(
          [
            ["title", isLegal ? tp.legalName : tp.individualName, "text"],
            ["address", isLegal ? tp.legalAddress : tp.individualAddress, "text"],
            ["phone", tp.phone, "tel"],
            ["email", tp.email, "email"],
          ] as const
        ).map(([name, label, inputType]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} type={inputType} placeholder={label} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
