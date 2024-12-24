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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditCriteriaForm } from "@/lib/audit/hooks";
import { auditCriteriaTypes } from "@/services/api-sdk/types/audit";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";

interface AuditCriteriaFormProps {
  formId: string;
  className?: string;
  onSubmit?: (data) => Promise<void>;
}

export default function AuditCriteriaForm({
  formId,
  className,
  onSubmit,
}: AuditCriteriaFormProps) {
  const form = useAuditCriteriaForm();
  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {auditCriteriaTypes.map((type) => (
                        <SelectItem value={type.value} key={type.value}>
                          {type.label}
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
              <FormLabel>Intitulé du critère</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Intitulé du critère"
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
          name="maxScore"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Note maximale</FormLabel>
              <FormControl>
                <div className="relative">
                  <NumberInput
                    {...field}
                    placeholder="Note maximale"
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
            <FormItem className="col-span-2">
              <FormLabel>Description du critère</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  placeholder="Description du critère"
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
