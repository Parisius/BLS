"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Link as LinkIcon, Newspaper, Tag } from "lucide-react";
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
import { useCreateBankItem, useUpdateBankItem } from "@/lib/texts-bank/hooks";
import { normalizeLink, useFileForm, useLinkForm } from "@/lib/texts-bank/forms";
import type { BankItem } from "@/lib/texts-bank/items";
import { KIND_KEY, type BankKind } from "@/lib/texts-bank/kinds";
import { useDictionary } from "@/lib/i18n/locale-provider";

function TitleField({ control, label }: { control: never; label: string }) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} placeholder={label} className="h-12 pl-10" />
              <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FileBody({ kind, formId, item, onDone }: { kind: BankKind; formId: string; item?: BankItem; onDone: () => void }) {
  const { t } = useDictionary();
  const tk = t.textsBank.kinds[KIND_KEY[kind]];
  const editing = !!item;
  const form = useFileForm(editing, item?.title);
  const { mutateAsync: create } = useCreateBankItem(kind);
  const { mutateAsync: update } = useUpdateBankItem(kind);

  const handleSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.set("title", values.title);
    if (values.file) formData.set("file", values.file);
    try {
      if (item) await update({ itemId: item.id, formData });
      else await create(formData);
      toast.success(editing ? tk.editSuccess : tk.addSuccess);
      form.reset({ title: editing ? values.title : "" });
      onDone();
    } catch {
      toast.error(editing ? tk.editError : tk.addError);
    }
  });

  return (
    <Form {...form}>
      <form id={formId} noValidate className="space-y-5" onSubmit={handleSubmit}>
        <TitleField control={form.control as never} label={tk.nameLabel} />
        <FormField
          control={form.control}
          name="file"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `value` is excluded: file inputs can't be value-controlled
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{tk.fieldLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="file"
                    placeholder={tk.fieldPlaceholder}
                    className="h-12 pl-10"
                    onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
                  />
                  <Newspaper className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              {editing && <p className="text-sm text-muted-foreground">{t.textsBank.common.fileHint}</p>}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function LinkBody({ kind, formId, item, onDone }: { kind: BankKind; formId: string; item?: BankItem; onDone: () => void }) {
  const { t } = useDictionary();
  const tk = t.textsBank.kinds[KIND_KEY[kind]];
  const editing = !!item;
  const form = useLinkForm(item ? { title: item.title, link: item.link ?? "" } : undefined);
  const { mutateAsync: create } = useCreateBankItem(kind);
  const { mutateAsync: update } = useUpdateBankItem(kind);

  const handleSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("link", normalizeLink(values.link));
    try {
      if (item) await update({ itemId: item.id, formData });
      else await create(formData);
      toast.success(editing ? tk.editSuccess : tk.addSuccess);
      form.reset(editing ? values : { title: "", link: "" });
      onDone();
    } catch {
      toast.error(editing ? tk.editError : tk.addError);
    }
  });

  return (
    <Form {...form}>
      <form id={formId} noValidate className="space-y-5" onSubmit={handleSubmit}>
        <TitleField control={form.control as never} label={tk.nameLabel} />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tk.fieldLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} placeholder={tk.fieldPlaceholder} className="h-12 pl-10" />
                  <LinkIcon className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
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

function BankFormDialog({
  kind,
  item,
  open,
  onOpenChange,
  trigger,
}: {
  kind: BankKind;
  item?: BankItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactElement;
}) {
  const { t } = useDictionary();
  const tk = t.textsBank.kinds[KIND_KEY[kind]];
  const tc = t.textsBank.common;
  const formId = useId();
  const editing = !!item;
  const Body = kind === "links" ? LinkBody : FileBody;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? tk.editTitle : tk.addTitle}</DialogTitle>
          <DialogDescription>{editing ? tk.editDescription : tk.addDescription}</DialogDescription>
        </DialogHeader>
        <Body kind={kind} formId={formId} item={item} onDone={() => onOpenChange(false)} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{tc.cancel}</DialogClose>
          <Button type="submit" form={formId}>
            {editing ? tc.save : tc.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddBankItemDialog({ kind, iconOnlyOnMobile = true }: { kind: BankKind; iconOnlyOnMobile?: boolean }) {
  const { t } = useDictionary();
  const tk = t.textsBank.kinds[KIND_KEY[kind]];
  const [open, setOpen] = useState(false);
  const Icon = kind === "links" ? LinkIcon : Newspaper;

  return (
    <BankFormDialog
      kind={kind}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="gap-2">
          <Icon />
          <span className={iconOnlyOnMobile ? "sr-only sm:not-sr-only" : undefined}>{tk.newButton}</span>
        </Button>
      }
    />
  );
}

/** Controlled: opened from a card's edit button; remounted per item so the form starts from its values. */
export function EditBankItemDialog({
  kind,
  item,
  onOpenChange,
}: {
  kind: BankKind;
  item: BankItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <BankFormDialog
      key={item?.id ?? "none"}
      kind={kind}
      item={item ?? undefined}
      open={!!item}
      onOpenChange={onOpenChange}
    />
  );
}
