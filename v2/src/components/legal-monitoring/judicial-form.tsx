"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Scale } from "lucide-react";
import type { Control, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LinkSelect } from "@/components/shared/link-select";
import { ActionField, MailFields, type MailFieldValues } from "@/components/legal-monitoring/mail-fields";
import { useAllJurisdictions } from "@/lib/litigation/hooks";
import {
  useCreateJudicialItem,
  useOneLegalItem,
  useUpdateJudicialItem,
} from "@/lib/legal-monitoring/hooks";
import { emptyMail, useJudicialForm, type JudicialFormValues } from "@/lib/legal-monitoring/forms";
import type { JudicialArgs, LegalItem } from "@/lib/legal-monitoring/items";
import { useDictionary } from "@/lib/i18n/locale-provider";

function JudicialFields({ formId, form, onSubmit }: {
  formId: string;
  form: UseFormReturn<JudicialFormValues>;
  onSubmit: (values: JudicialFormValues) => Promise<void>;
}) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.judicialForm;
  const { data: jurisdictions, isLoading } = useAllJurisdictions();
  const action = form.watch("actionType");
  const mailControl = form.control as unknown as Control<MailFieldValues>;

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{tf.title}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={tf.title} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jurisdictionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.jurisdiction}</FormLabel>
              <FormControl>
                <LinkSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={jurisdictions}
                  isLoading={isLoading}
                  placeholder={tf.selectJurisdiction}
                  loadingLabel={tf.loading}
                  emptyLabel={tf.noJurisdictions}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jurisdictionLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.jurisdictionLocation}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={tf.jurisdictionLocation} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(
          [
            ["summary", tf.summary],
            ["innovation", tf.innovation],
          ] as const
        ).map(([name, label]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={label} className="resize-none" rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <ActionField control={mailControl} />
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.eventDate}</FormLabel>
              <FormControl>
                <Input {...field} type="date" className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {action === "transfer_mail" && <MailFields control={mailControl} />}
      </form>
    </Form>
  );
}

const toArgs = (values: JudicialFormValues): JudicialArgs => ({
  title: values.title,
  summary: values.summary,
  innovation: values.innovation,
  eventDate: values.eventDate,
  jurisdictionId: values.jurisdictionId,
  jurisdictionLocation: values.jurisdictionLocation,
  isArchived: values.actionType === "archive",
  mail: values.actionType === "transfer_mail" ? values.mail : undefined,
});

export function AddJudicialDialog({ variant = "list" }: { variant?: "list" | "card" }) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.judicialForm;
  const router = useRouter();
  const formId = useId();
  const form = useJudicialForm();
  const { mutateAsync } = useCreateJudicialItem();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: JudicialFormValues) => {
    try {
      const created = await mutateAsync(toArgs(values));
      toast.success(tf.addSuccess);
      form.reset();
      setOpen(false);
      router.push(`/dashboard/legal-monitoring/judicial/${created.id}`);
    } catch {
      toast.error(tf.addError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Scale />
        {variant === "card" ? (
          t.legalMonitoring.judicialCard.button
        ) : (
          <span className="sr-only sm:not-sr-only">{t.legalMonitoring.judicialList.newItem}</span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tf.addTitle}</DialogTitle>
          <DialogDescription>{tf.addDescription}</DialogDescription>
        </DialogHeader>
        <div className="-mx-4 max-h-[70vh] overflow-y-auto px-4 py-3">
          <JudicialFields formId={formId} form={form} onSubmit={handleSubmit} />
        </div>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tf.cancel}
          </DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tf.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateJudicialBody({ item, onClose }: { item: LegalItem; onClose: () => void }) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.judicialForm;
  const formId = useId();
  const form = useJudicialForm({
    title: item.title,
    summary: item.summary,
    innovation: item.innovation,
    eventDate: item.eventDate ?? "",
    jurisdictionId: item.jurisdiction?.id ?? "",
    jurisdictionLocation: item.jurisdictionLocation ?? "",
    actionType: item.isArchived ? "archive" : "transfer_mail",
    mail: item.mail ?? emptyMail,
  });
  const { mutateAsync } = useUpdateJudicialItem(item.id);

  const handleSubmit = async (values: JudicialFormValues) => {
    try {
      await mutateAsync(toArgs(values));
      toast.success(tf.editSuccess);
      onClose();
    } catch {
      toast.error(tf.editError);
    }
  };

  return (
    <>
      <div className="-mx-4 max-h-[70vh] overflow-y-auto px-4 py-3">
        <JudicialFields formId={formId} form={form} onSubmit={handleSubmit} />
      </div>
      <DialogFooter className="gap-2">
        <DialogClose render={<Button type="button" variant="destructive" />}>{tf.cancel}</DialogClose>
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "..." : tf.save}
        </Button>
      </DialogFooter>
    </>
  );
}

/** Controlled: opened from the details table. */
export function UpdateJudicialDialog({
  itemId,
  open,
  onOpenChange,
}: {
  itemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.judicialForm;
  const { data, isLoading, isError } = useOneLegalItem(itemId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tf.editTitle}</DialogTitle>
          <DialogDescription>{tf.editDescription}</DialogDescription>
        </DialogHeader>
        {isError && <p className="text-destructive">{t.common.loadError}</p>}
        {isLoading && <p className="italic text-muted-foreground">{tf.loading}</p>}
        {data && <UpdateJudicialBody item={data} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
