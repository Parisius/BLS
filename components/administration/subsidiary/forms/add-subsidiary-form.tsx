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
import { useSubsidiaryForm } from "@/lib/administration/subsidiary/hooks";
import { useCreateSubsidiary } from "@/services/api-sdk/models/administration/subsidiary/subsidiary";
import { cn } from "@/lib/utils";
import CountrySelect from "@/components/ui/country-select";

interface AddSubsidiaryFormProps {
  className?: string;
  formId: string;
  onSuccess?: (createdData: any) => void;
  onError?: () => void;
}

export default function AddSubsidiaryForm({
  formId,
  className,
  onSuccess,
  onError,
}: AddSubsidiaryFormProps) {
  const form = useSubsidiaryForm();
  const { mutateAsync } = useCreateSubsidiary();
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: "Filiale créée avec succès.",
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description:
              "Une erreur s'est produite lors de la création de la filiale.",
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
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} placeholder="Nom" className="h-12 pl-10" />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Pays</FormLabel>
              <FormControl>
                <CountrySelect
                  value={field.value}
                  placeholder="Pays"
                  className="h-12"
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Adresse"
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
