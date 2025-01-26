"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  DateField,
  NumberField,
  RadioField,
  SelectField,
  TextField,
} from "@/components/litigation/inputs/complete-litigation-task-fields";
import { useCompleteLitigationTaskForm } from "@/lib/litigation/hooks";
import { useCompleteLitigationTask } from "@/services/api-sdk/models/litigation";
import DocumentsSectionForm from "@/components/litigation/forms/documents-section-form";
import { useIntl } from "react-intl";

export default function CompleteLitigationTaskForm({
  formId,
  taskId,
  stepForm,
  className,
  onError,
  onSuccess,
}) {
  const { form, filesArray } = useCompleteLitigationTaskForm(stepForm.fields);
  const { mutateAsync } = useCompleteLitigationTask(taskId);
  const intl = useIntl();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.tasks.success",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "litigation.litigation.tasks.error",
            }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
  );

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("space-y-5", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {stepForm.fields.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => {
              if (item.type === "text") {
                return (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <TextField
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }
              if (item.type === "radio") {
                return (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="text-md">{item.label}</FormLabel>
                    <FormControl>
                      <RadioField
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }
              if (item.type === "number") {
                return (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <NumberField
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }
              if (item.type === "date") {
                return (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <DateField
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }
              if (item.type === "select") {
                return (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <SelectField
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }
              return (
                <DocumentsSectionForm
                  label={intl.formatMessage({
                    id: "litigation.tasks.documents",
                  })}
                  fieldName={item.name}
                  form={form}
                  fieldArray={filesArray}
                  className="col-span-2 rounded-xl border-2 p-5"
                />
              );
            }}
          />
        ))}
      </form>
    </Form>
  );
}
