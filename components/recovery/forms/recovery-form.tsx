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
import { cn } from "@/lib/utils";
import { useRecoveryForm } from "@/lib/recovery/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecoveryTypes } from "@/services/api-sdk/types/recovery/recovery";
import ContractSelect from "@/components/recovery/inputs/contract-select";
import GuaranteeSelect from "@/components/recovery/inputs/guarantee-select";
import { useIntl } from "react-intl";

export default function RecoveryForm({ formId, className, onSubmit }) {
  const intl = useIntl();
  const form = useRecoveryForm();
  const recoveryTypes = useRecoveryTypes();

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("space-y-5", className)}
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{intl.formatMessage({ id: "type" })}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue
                      placeholder={intl.formatMessage({
                        id: "recovery.typePlaceholder",
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {recoveryTypes.map((type) => (
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: "recovery.title" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "recovery.titlePlaceholder",
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

        {form.watch("type").includes("with_guarantee") && (
          <FormField
            control={form.control}
            name="guaranteeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "recovery.guarantee" })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <GuaranteeSelect
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
        )}

        {form.watch("type").includes("without_guarantee") && (
          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "recovery.contract" })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <ContractSelect
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
        )}
      </form>
    </Form>
  );
}
