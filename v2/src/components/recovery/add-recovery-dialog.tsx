"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LinkSelect } from "@/components/shared/link-select";
import {
  useCreateRecovery,
  useFormalizedGuarantees,
  useRecoverableContracts,
} from "@/lib/recovery/hooks";
import { RECOVERY_TYPES, useRecoveryForm } from "@/lib/recovery/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AddRecoveryDialog() {
  const form = useRecoveryForm();
  const { mutateAsync } = useCreateRecovery();
  const router = useRouter();
  const { t } = useDictionary();
  const tr = t.recovery;
  const [open, setOpen] = useState(false);

  const type = form.watch("type");
  const withGuarantee = !type.includes("without");
  const guarantees = useFormalizedGuarantees();
  const contracts = useRecoverableContracts();
  const typeItems = RECOVERY_TYPES.map((value) => ({ value, label: tr.types[value] }));

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: (recovery) => {
        toast.success(tr.addDialog.success);
        form.reset();
        setOpen(false);
        router.push(`/dashboard/recovery/${recovery.id}`);
      },
      onError: () => toast.error(tr.addDialog.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <FolderPlus />
        <span className="sr-only sm:not-sr-only">{tr.hub.newRecovery}</span>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tr.addDialog.title}</DialogTitle>
          <DialogDescription>{tr.addDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-recovery-form" noValidate className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr.form.type}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(next) => {
                        field.onChange(next);
                        form.setValue("guaranteeId", "");
                        form.setValue("contractId", "");
                      }}
                      items={typeItems}
                    >
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder={tr.form.typePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {typeItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tr.form.title}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {withGuarantee ? (
              <FormField
                control={form.control}
                name="guaranteeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tr.form.guarantee}</FormLabel>
                    <FormControl>
                      <LinkSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={guarantees.data}
                        isLoading={guarantees.isLoading}
                        placeholder={tr.form.selectGuarantee}
                        loadingLabel={tr.form.loading}
                        emptyLabel={tr.form.noGuarantees}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="contractId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tr.form.contract}</FormLabel>
                    <FormControl>
                      <LinkSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={contracts.data}
                        isLoading={contracts.isLoading}
                        placeholder={tr.form.selectContract}
                        loadingLabel={tr.form.loading}
                        emptyLabel={tr.form.noContracts}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tr.addDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-recovery-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tr.addDialog.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
