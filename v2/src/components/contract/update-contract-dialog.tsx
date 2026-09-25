"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategorySelect, CategoryTypeSelect, CategorySubTypeSelect } from "@/components/contract/selects";
import { StakeholderSectionForm } from "@/components/contract/stakeholder-section-form";
import { useUpdateContractForm } from "@/lib/contract/forms";
import { useOneContract, useUpdateContract } from "@/lib/contract/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface UpdateContractDialogProps {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateContractDialog({ contractId, open, onOpenChange }: UpdateContractDialogProps) {
  const { data } = useOneContract(contractId);
  const { form, firstStakeholdersGroup, secondStakeholdersGroup } = useUpdateContractForm();
  const { mutateAsync } = useUpdateContract(contractId);
  const { t } = useDictionary();
  const tc = t.contract;

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        category: String(data.category.id),
        categoryType: data.categoryType ? String(data.categoryType.id) : "",
        categorySubType: data.categorySubType ? String(data.categorySubType.id) : "",
        firstStakeholdersGroup:
          data.firstStakeholdersGroup.length > 0
            ? data.firstStakeholdersGroup
            : [{ stakeholderId: "", description: "" }],
        secondStakeholdersGroup:
          data.secondStakeholdersGroup.length > 0
            ? data.secondStakeholdersGroup
            : [{ stakeholderId: "", description: "" }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(tc.updateForm.success);
        onOpenChange(false);
      },
      onError: () => toast.error(tc.updateForm.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{tc.updateDialog.title}</DialogTitle>
          <DialogDescription>{tc.updateDialog.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="update-contract-form"
            className="-mx-4 -my-3 grid max-h-[70vh] grid-cols-1 gap-x-5 gap-y-10 overflow-y-auto px-4 py-3 sm:grid-cols-3"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>{tc.updateForm.titleLabel}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        className="h-12 pl-10"
                      />
                      <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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
                  <FormLabel>{tc.updateForm.categoryLabel}</FormLabel>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
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
                  <FormLabel>{tc.updateForm.categoryTypeLabel}</FormLabel>
                  <FormControl>
                    <CategoryTypeSelect
                      category={form.watch("category")}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!form.watch("category") || form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
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
                  <FormLabel>{tc.updateForm.categorySubTypeLabel}</FormLabel>
                  <FormControl>
                    <CategorySubTypeSelect
                      categoryType={form.watch("categoryType")}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!form.watch("categoryType") || form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <StakeholderSectionForm
              label={tc.updateForm.party1Label}
              fieldName="firstStakeholdersGroup"
              control={form.control}
              fieldArray={firstStakeholdersGroup}
              isSubmitting={form.formState.isSubmitting}
              className="col-span-full mt-4 rounded-xl border-2 p-5"
            />

            <StakeholderSectionForm
              label={tc.updateForm.party2Label}
              fieldName="secondStakeholdersGroup"
              control={form.control}
              fieldArray={secondStakeholdersGroup}
              isSubmitting={form.formState.isSubmitting}
              className="col-span-full mt-4 rounded-xl border-2 p-5"
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="destructive" onClick={() => onOpenChange(false)}>
            {tc.updateDialog.cancel}
          </Button>
          <Button type="submit" form="update-contract-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.updateDialog.update}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
