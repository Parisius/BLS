"use client";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useForwardIncidentTask } from "@/services/api-sdk/models/account-incident/incident-task";
import { useForwardIncidentTaskForm } from "@/lib/account-incident/hooks";
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
import { Textarea } from "@/components/ui/textarea";
import UserSelect from "@/components/account-incident/inputs/user-select";
export default function ForwardIncidentTaskForm({
  formId,
  taskId,
  onSuccess,
  onError,
}) {
  const form = useForwardIncidentTaskForm();
  const { mutateAsync } = useForwardIncidentTask(taskId);
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (updatedData) => {
          toast({
            description: "Tâche transférée avec succès",
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(updatedData);
        },
        onError: () => {
          toast({
            description:
              "Une erreur est survenue lors du transfert de la tâche",
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess]
  );
  return (
    <Form {...form}>
      <form
        id={formId}
        className="space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objet</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Objet"
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
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d&apos;échéance</FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  className="h-12"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Destinataire</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserSelect
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  placeholder="Observations"
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
