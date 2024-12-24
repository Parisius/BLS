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
import { useUserForm } from "@/lib/administration/user/hooks";
import { useCreateUser } from "@/services/api-sdk/models/administration/user/user";
import { cn } from "@/lib/utils";
import SubsidiarySelect from "@/components/administration/user/inputs/subsidiary-select";
import RoleSelect from "@/components/administration/user/inputs/role-select";

interface AddUserFormProps {
  className?: string;
  formId: string;
  onSuccess?: (createdData: any) => void;
  onError?: () => void;
}

export default function AddUserForm({ formId, className, onSuccess, onError }:AddUserFormProps) {
  const form = useUserForm();
  const { mutateAsync } = useCreateUser();
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(
        {
          ...data,
          roleIds: [data.roleId],
        },
        {
          onSuccess: (createdData) => {
            toast({
              description: "Utilisateur créé avec succès.",
              className: "bg-primary text-primary-foreground",
            });
            onSuccess?.(createdData);
          },
          onError: () => {
            toast({
              description:
                "Une erreur s'est produite lors de la création de l'utilisateur.",
              className: "bg-destructive text-destructive-foreground",
            });
            onError?.();
          },
        }
      );
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
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom & Prénom (s)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Nom & Prénom (s)"
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
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénoms</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Prénoms"
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Nom d'utilisateur"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Email"
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
          name="roleId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Rôle</FormLabel>
              <FormControl>
                <div className="relative">
                  <RoleSelect
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
          name="subsidiaryId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Filiale</FormLabel>
              <FormControl>
                <div className="relative">
                  <SubsidiarySelect
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
      </form>
    </Form>
  );
}
