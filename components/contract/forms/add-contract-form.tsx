"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCreateContract } from "@/services/api-sdk/models/contract/contract";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import CategorySelect from "@/components/contract/inputs/category-select";
import CategoryTypeSelect from "@/components/contract/inputs/category-type-select";
import ContractStakeholderSectionForm from "@/components/contract/forms/contract-stakeholder-section-form";
import DocumentsForm from "@/components/ui/documents-form";
import { useAddContractForm } from "@/lib/contract/hooks";
import CategorySubTypeSelect from "@/components/contract/inputs/category-subtype-select";
import { useIntl } from "react-intl";

export default function AddContractForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const { form, firstStakeholdersGroup, secondStakeholdersGroup, filesArray } =
    useAddContractForm();
  const { mutateAsync } = useCreateContract();

  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.successMessage",
            }),
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description: intl.formatMessage({
              id: "contract.contract.errorMessage",
            }),
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess, intl]
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
        className={cn("grid grid-cols-3 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>
                {intl.formatMessage({ id: "contract.contract.titleLabel" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.titlePlaceholder",
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: "contract.contract.categoryLabel" })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <CategorySelect
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
          name="categoryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.categoryTypeLabel",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <CategoryTypeSelect
                    category={form.watch("category")}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !form.watch("category") || form.formState.isSubmitting
                    }
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
          name="categorySubType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.categorySubTypeLabel",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <CategorySubTypeSelect
                    categoryType={form.watch("categoryType") ?? ""}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !form.watch("categoryType") || form.formState.isSubmitting
                    }
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ContractStakeholderSectionForm
          label={intl.formatMessage({
            id: "contract.contract.stakeholderSectionLabel1",
          })}
          fieldName="firstStakeholdersGroup"
          form={form}
          fieldArray={firstStakeholdersGroup}
          className="col-span-3 rounded-xl border-2 p-5"
        />

        <ContractStakeholderSectionForm
          label={intl.formatMessage({
            id: "contract.contract.stakeholderSectionLabel2",
          })}
          fieldName="secondStakeholdersGroup"
          form={form}
          fieldArray={secondStakeholdersGroup}
          className="col-span-3 rounded-xl border-2 p-5"
        />

        <DocumentsForm
          label={intl.formatMessage({ id: "contract.contract.documentsLabel" })}
          fieldName="files"
          form={form}
          fieldArray={filesArray}
          className="col-span-3"
        />
      </form>
    </Form>
  );
}
