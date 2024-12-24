"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
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
import { useRoleForm } from "@/lib/administration/role/hooks";
import { useCreateRole } from "@/services/api-sdk/models/administration/role/role";
import { cn } from "@/lib/utils";

interface AddRoleFormProps {
  className?: string;
  formId: string;
  onSuccess?: (createdData: any) => void;
  onError?: () => void;
}

export default function AddRoleForm({
  formId,
  className,
  onSuccess,
  onError,
}: AddRoleFormProps) {
  const form = useRoleForm();
  const { mutateAsync } = useCreateRole();
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: "Rôle créé avec succès.",
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description:
              "Une erreur s'est produite lors de la création du rôle.",
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess]
  );
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);
  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Intitulé</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Intitulé"
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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
