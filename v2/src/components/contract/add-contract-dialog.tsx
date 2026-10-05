"use client";

import { Can } from "@/components/auth/can";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { DocumentsForm } from "@/components/contract/documents-form";
import { useAddContractForm } from "@/lib/contract/forms";
import { useCreateContract } from "@/lib/contract/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

function AddContractDialogInner() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { form, firstStakeholdersGroup, secondStakeholdersGroup, filesArray } = useAddContractForm();
  const { mutateAsync } = useCreateContract();
  const { t } = useDictionary();
  const tc = t.contract;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: (created) => {
        toast.success(tc.successMessage);
        form.reset();
        setOpen(false);
        router.push(`/dashboard/contract/${created.id}`);
      },
      onError: () => toast.error(tc.errorMessage),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <FolderPlus />
        <span className="sr-only sm:not-sr-only">{tc.newContractButton}</span>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{tc.newContractTitle}</DialogTitle>
          <DialogDescription>{tc.newContractDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="add-contract-form"
            className="-mx-4 -my-3 grid max-h-[70vh] grid-cols-1 gap-x-5 gap-y-10 overflow-y-auto px-4 py-3 sm:grid-cols-3"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>{tc.titleLabel}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        placeholder={tc.titlePlaceholder}
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
                  <FormLabel>{tc.categoryLabel}</FormLabel>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("categoryType", "");
                        form.setValue("categorySubType", "");
                      }}
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
                  <FormLabel>{tc.categoryTypeLabel}</FormLabel>
                  <FormControl>
                    <CategoryTypeSelect
                      category={form.watch("category")}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("categorySubType", "");
                      }}
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
                  <FormLabel>{tc.categorySubTypeLabel}</FormLabel>
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
              label={tc.stakeholderSectionLabel1}
              fieldName="firstStakeholdersGroup"
              control={form.control}
              fieldArray={firstStakeholdersGroup}
              isSubmitting={form.formState.isSubmitting}
              className="col-span-full mt-4 rounded-xl border-2 p-5"
            />

            <StakeholderSectionForm
              label={tc.stakeholderSectionLabel2}
              fieldName="secondStakeholdersGroup"
              control={form.control}
              fieldArray={secondStakeholdersGroup}
              isSubmitting={form.formState.isSubmitting}
              className="col-span-full mt-4 rounded-xl border-2 p-5"
            />

            <DocumentsForm
              label={tc.documentsLabel}
              fieldName="files"
              control={form.control}
              fieldArray={filesArray}
              isSubmitting={form.formState.isSubmitting}
              className="col-span-full mt-4"
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="destructive" onClick={() => form.reset()}>
            {tc.cancelButton}
          </Button>
          <Button type="submit" form="add-contract-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.initiateButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddContractDialog() {
  return (
    <Can permission="contract.create">
      <AddContractDialogInner />
    </Can>
  );
}
