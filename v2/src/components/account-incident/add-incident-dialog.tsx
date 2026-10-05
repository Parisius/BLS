"use client";

import { Can } from "@/components/auth/can";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthorSelect } from "@/components/account-incident/author-select";
import { useCreateIncident } from "@/lib/account-incident/hooks";
import { INCIDENT_CATEGORIES, useIncidentForm } from "@/lib/account-incident/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";

function AddIncidentDialogInner() {
  const form = useIncidentForm();
  const { mutateAsync } = useCreateIncident();
  const router = useRouter();
  const { t } = useDictionary();
  const ta = t.accountIncident;
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const categoryItems = INCIDENT_CATEGORIES.map((value) => ({ value, label: ta.categories[value] }));

  // The incident can't be edited once created, so the details are validated
  // first and only then does the confirmation step appear.
  const askConfirmation = async () => {
    if (await form.trigger()) setConfirming(true);
  };

  const submit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: (incident) => {
        toast.success(ta.addDialog.success);
        form.reset();
        setConfirming(false);
        setOpen(false);
        router.push(`/dashboard/account-incident/${incident.id}`);
      },
      onError: () => {
        toast.error(ta.addDialog.error);
        setConfirming(false);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <FolderPlus />
        <span className="sr-only sm:not-sr-only">{ta.hub.newIncident}</span>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{ta.addDialog.title}</DialogTitle>
          <DialogDescription>{ta.addDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-incident-form"
            noValidate
            className="-mx-4 max-h-[60vh] space-y-6 overflow-y-auto px-4 py-1"
            onSubmit={(e) => {
              e.preventDefault();
              void askConfirmation();
            }}
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.form.category}</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? null} onValueChange={field.onChange} items={categoryItems}>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder={ta.form.categoryPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryItems.map((item) => (
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
                  <FormLabel>{ta.form.title}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateReceived"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.form.dateReceived}</FormLabel>
                  <FormControl>
                    <Input type="date" max={new Date().toLocaleDateString("en-CA")} {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.form.author}</FormLabel>
                  <FormControl>
                    <AuthorSelect value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isClient"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel className="text-base">{ta.form.isClient}</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {ta.addDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-incident-form">
            {ta.addDialog.submit}
          </Button>
        </DialogFooter>

        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{ta.confirmDialog.title}</AlertDialogTitle>
              <AlertDialogDescription>{ta.confirmDialog.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">{ta.confirmDialog.verify}</AlertDialogCancel>
              <Button type="button" disabled={form.formState.isSubmitting} onClick={() => void submit()}>
                {form.formState.isSubmitting ? "..." : ta.confirmDialog.submit}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

export function AddIncidentDialog() {
  return (
    <Can permission="incident.create">
      <AddIncidentDialogInner />
    </Can>
  );
}
