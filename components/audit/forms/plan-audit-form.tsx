"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePlanAuditForm } from "@/lib/audit/hooks/use-plan-audit-form";
import { cn } from "@/lib/utils";
export default function PlanAuditForm({ formId, className, onSubmit }) {
  const { form } = usePlanAuditForm();

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("flex flex-col gap-5", className)}
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <Input
                type="text"
                {...field}
                placeholder="Entrez le titre"
                className="input input-bordered h-12"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jour d&apos;audit</FormLabel>
              <Input
                type="date"
                {...field}
                placeholder="Entrez le titre"
                className="input input-bordered h-12"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
