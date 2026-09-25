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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { LinkSelect } from "@/components/shared/link-select";
import { ActionField, MailFields, type MailFieldValues } from "@/components/legal-monitoring/mail-fields";
import { useAllNatures } from "@/lib/litigation/hooks";
import {
  useCreateLegislativeItem,
  useOneLegalItem,
  useUpdateLegislativeItem,
} from "@/lib/legal-monitoring/hooks";
import { emptyMail, useLegislativeForm, type LegislativeFormValues } from "@/lib/legal-monitoring/forms";
import type { LegislativeArgs, LegalItem } from "@/lib/legal-monitoring/items";
import { useDictionary } from "@/lib/i18n/locale-provider";

function LegislativeFields({ formId, form, onSubmit }: {
  formId: string;
  form: UseFormReturn<LegislativeFormValues>;
  onSubmit: (values: LegislativeFormValues) => Promise<void>;
}) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.legislativeForm;
  const { data: natures, isLoading } = useAllNatures();
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
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <RadioGroup
                value={field.value}
                onValueChange={(next) => field.onChange(next)}
                className="flex items-center justify-center gap-5"
              >
                {(
                  [
                    ["legislation", tf.newLaw],
                    ["regulation", tf.newRegulation],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm font-normal">
                    <RadioGroupItem value={value} />
                    {label}
                  </label>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        {(
          [
            ["title", tf.title],
            ["caseNumber", tf.caseNumber],
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
                  <Input {...field} placeholder={label} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="natureId"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{tf.nature}</FormLabel>
              <FormControl>
                <LinkSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={natures}
                  isLoading={isLoading}
                  placeholder={tf.selectNature}
                  loadingLabel={tf.loading}
                  emptyLabel={tf.noNatures}
                />
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
          name="effectiveDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tf.effectiveDate}</FormLabel>
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

const toArgs = (values: LegislativeFormValues): LegislativeArgs => ({
  title: values.title,
  caseNumber: values.caseNumber,
  summary: values.summary,
  innovation: values.innovation,
  effectiveDate: values.effectiveDate,
  natureId: values.natureId,
  type: values.type,
  isArchived: values.actionType === "archive",
  mail: values.actionType === "transfer_mail" ? values.mail : undefined,
});

export function AddLegislativeDialog({ variant = "list" }: { variant?: "list" | "card" }) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.legislativeForm;
  const router = useRouter();
  const formId = useId();
  const form = useLegislativeForm();
  const { mutateAsync } = useCreateLegislativeItem();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: LegislativeFormValues) => {
    try {
      const created = await mutateAsync(toArgs(values));
      toast.success(tf.addSuccess);
      form.reset();
      setOpen(false);
      router.push(`/dashboard/legal-monitoring/legislative/${created.id}`);
    } catch {
      toast.error(tf.addError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Scale />
        {variant === "card" ? (
          t.legalMonitoring.legislativeCard.button
        ) : (
          <span className="sr-only sm:not-sr-only">{t.legalMonitoring.legislativeList.newItem}</span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tf.addTitle}</DialogTitle>
          <DialogDescription>{tf.addDescription}</DialogDescription>
        </DialogHeader>
        <div className="-mx-4 max-h-[70vh] overflow-y-auto px-4 py-3">
          <LegislativeFields formId={formId} form={form} onSubmit={handleSubmit} />
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

function UpdateLegislativeBody({ item, onClose }: { item: LegalItem; onClose: () => void }) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.legislativeForm;
  const formId = useId();
  const form = useLegislativeForm({
    type: item.type === "regulation" ? "regulation" : "legislation",
    title: item.title,
    caseNumber: item.caseNumber ?? "",
    natureId: item.nature?.id ?? "",
    summary: item.summary,
    innovation: item.innovation,
    effectiveDate: item.effectiveDate ?? "",
    actionType: item.isArchived ? "archive" : "transfer_mail",
    mail: item.mail ?? emptyMail,
  });
  const { mutateAsync } = useUpdateLegislativeItem(item.id);

  const handleSubmit = async (values: LegislativeFormValues) => {
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
        <LegislativeFields formId={formId} form={form} onSubmit={handleSubmit} />
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
export function UpdateLegislativeDialog({
  itemId,
  open,
  onOpenChange,
}: {
  itemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tf = t.legalMonitoring.legislativeForm;
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
        {data && <UpdateLegislativeBody item={data} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
