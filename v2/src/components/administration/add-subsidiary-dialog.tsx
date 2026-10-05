"use client";

import { Can } from "@/components/auth/can";
import { useState } from "react";
import { Landmark, Tag } from "lucide-react";
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
import { useSubsidiaryForm } from "@/lib/administration/forms";
import { useCreateSubsidiary } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

function AddSubsidiaryDialogInner() {
  const [open, setOpen] = useState(false);
  const form = useSubsidiaryForm();
  const { mutateAsync } = useCreateSubsidiary();
  const { t } = useDictionary();
  const ts = t.administration.subsidiaries;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(ts.createSuccess);
        form.reset();
        setOpen(false);
      },
      onError: () => toast.error(ts.createError),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Landmark />
        <span className="sr-only sm:not-sr-only">{ts.newSubsidiary}</span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{ts.dialogTitle}</DialogTitle>
          <DialogDescription>{ts.dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="add-subsidiary-form"
            className="grid gap-6"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts.fieldName}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="h-12 pl-10" />
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
                <FormItem>
                  <FormLabel>{ts.fieldCountry}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" placeholder={ts.fieldCountry} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts.fieldAddress}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="h-12 pl-10" />
                      <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="destructive" onClick={() => form.reset()}>
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            form="add-subsidiary-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t.common.creating : t.common.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddSubsidiaryDialog() {
  return (
    <Can permission="subsidiary.create">
      <AddSubsidiaryDialogInner />
    </Can>
  );
}
