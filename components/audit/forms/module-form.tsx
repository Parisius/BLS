import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { auditModules } from "@/services/api-sdk/types/audit";
import { useModuleForm } from "@/lib/audit/hooks";
export default function ModuleForm({ className }: { className?: string }) {
  const form = useModuleForm();
  return (
    <Form {...form}>
      <form className={className}>
        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {auditModules.map((module) => (
                      <SelectItem value={module.value} key={module.value}>
                        {module.labels.singular}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
