"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { useAllIncidentAuthors, useCreateIncidentAuthor } from "@/lib/account-incident/hooks";
import { useIncidentAuthorForm } from "@/lib/account-incident/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";

function AddAuthorDialog({ onCreated }: { onCreated: (authorId: string) => void }) {
  const form = useIncidentAuthorForm();
  const { mutateAsync } = useCreateIncidentAuthor();
  const { t } = useDictionary();
  const ta = t.accountIncident.author;
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    // This dialog is rendered inside the incident form's dialog: without
    // stopping propagation the nested submit would also submit the outer form.
    event.stopPropagation();
    return form.handleSubmit(async (values) => {
      await mutateAsync(values, {
        onSuccess: (author) => {
          toast.success(ta.success);
          form.reset();
          setOpen(false);
          onCreated(author.id);
        },
        onError: () => toast.error(ta.error),
      });
    })(event);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" className="h-12 gap-2" />}>
        <Plus size={16} />
        <span className="sr-only">{ta.addAuthor}</span>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{ta.dialogTitle}</DialogTitle>
          <DialogDescription>{ta.dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-author-form" noValidate className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.nameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
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
                  <FormLabel>{ta.emailLabel}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.phoneLabel}</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {ta.cancel}
          </DialogClose>
          <Button type="submit" form="add-author-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : ta.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Author picker with an "add author" button next to it. (The original nested a
 * dialog trigger inside the Select's popup, which is fragile with focus/portals.)
 */
export function AuthorSelect({
  value,
  onValueChange,
  disabled,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  const { data, isLoading } = useAllIncidentAuthors();
  const { t } = useDictionary();
  const ta = t.accountIncident.author;

  const items = useMemo(() => (data ?? []).map((author) => ({ value: author.id, label: author.name })), [data]);

  return (
    <div className="flex gap-2">
      <Select value={value || null} onValueChange={(next) => onValueChange(next ?? "")} disabled={disabled} items={items}>
        <SelectTrigger className="h-12 flex-1">
          <SelectValue placeholder={ta.selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {isLoading && (
            <SelectItem disabled value="__loading__">
              {ta.loading}
            </SelectItem>
          )}
          {!isLoading && items.length === 0 && (
            <SelectItem disabled value="__empty__">
              {ta.empty}
            </SelectItem>
          )}
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <AddAuthorDialog onCreated={onValueChange} />
    </div>
  );
}
