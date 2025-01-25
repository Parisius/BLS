"use client";
import AuthorSelect from "@/components/account-incident/inputs/author-select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountIncidentForm } from "@/lib/account-incident/hooks";
import { cn } from "@/lib/utils";
import { getIncidentCategories } from "@/services/api-sdk/types/account-incident/account-incident";
import { Tag } from "lucide-react";
import { useIntl } from "react-intl";

export default function AccountIncidentForm({ formId, className, onSubmit }) {
  const intl = useIntl();
  const form = useAccountIncidentForm();
  const incidentCategories = getIncidentCategories(intl);

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({ id: "incident.incident.form.category" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "incident.incident.form.categoryPlaceholder",
                        })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentCategories.map((category) => (
                        <SelectItem value={category.value} key={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({ id: "incident.incident.form.title" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "incident.incident.form.titlePlaceholder",
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
          name="dateReceived"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({
                  id: "incident.incident.form.dateReceived",
                })}
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="w-full h-12 px-3 rounded-md border border-input bg-background"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={form.formState.isSubmitting}
                  max={new Date().toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: "incident.incident.form.author" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <AuthorSelect
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
          name="isClient"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormLabel className="text-md">
                {intl.formatMessage({ id: "incident.incident.form.isClient" })}
              </FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
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
