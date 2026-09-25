"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import {
  Dialog,
  DialogClose,
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
import { useContractEventForm } from "@/lib/contract/forms";
import { useCreateContractEvent, useUpdateContractEvent } from "@/lib/contract/hooks";
import { toDateInputValue } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { ContractEvent } from "@/lib/contract/events";

interface EventFormFieldsProps {
  formId: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

function EventFormFields({ formId, form, onSubmit }: EventFormFieldsProps & { form: ReturnType<typeof useContractEventForm> }) {
  const { t } = useDictionary();

  return (
    <Form {...form}>
      <form id={formId} className="space-y-5" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.contract.events.eventTitle}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="h-12 pl-10" />
                  <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.contract.events.dueDate}</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function AddContractEventDialog({
  contractId,
  open,
  onOpenChange,
}: {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useContractEventForm();
  const { mutateAsync } = useCreateContractEvent(contractId);
  const { t } = useDictionary();
  const tc = t.contract;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(tc.events.success);
        form.reset();
        onOpenChange(false);
      },
      onError: () => toast.error(tc.events.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tc.events.newEventTitle}</DialogTitle>
          <DialogDescription>{tc.events.newEventDescription}</DialogDescription>
        </DialogHeader>
        <EventFormFields formId="add-event-form" form={form} onSubmit={handleSubmit} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tc.events.cancelButton}
          </DialogClose>
          <Button type="submit" form="add-event-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.events.addButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateContractEventDialog({
  contractId,
  event,
  open,
  onOpenChange,
}: {
  contractId: string;
  event: ContractEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useContractEventForm();
  const { mutateAsync } = useUpdateContractEvent(contractId, event?.id ?? "");
  const { t } = useDictionary();
  const tc = t.contract;

  useEffect(() => {
    if (event) {
      form.reset({ title: event.title, dueDate: toDateInputValue(event.dueDate) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success("Evénement modifié avec succès !");
        onOpenChange(false);
      },
      onError: () => toast.error("Une erreur est survenue lors de la modification."),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tc.events.updateTitle}</DialogTitle>
          <DialogDescription>{tc.events.updateDescription}</DialogDescription>
        </DialogHeader>
        <EventFormFields formId="update-event-form" form={form} onSubmit={handleSubmit} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tc.events.cancelButton}
          </DialogClose>
          <Button type="submit" form="update-event-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.events.updateButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
