"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { UserSelect } from "@/components/contract/selects";
import { useForwardForm } from "@/lib/contract/forms";
import { useForwardContract, useForwardContractEvent } from "@/lib/contract/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface ForwardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function useForwardMutation(
  target: { kind: "contract"; contractId: string } | { kind: "event"; contractId: string; eventId: string },
) {
  const contractForward = useForwardContract(target.contractId);
  const eventForward = useForwardContractEvent(
    target.contractId,
    target.kind === "event" ? target.eventId : "",
  );
  return target.kind === "contract" ? contractForward : eventForward;
}

export function ForwardContractDialog({
  target,
  ...props
}: ForwardDialogProps & {
  target: { kind: "contract"; contractId: string } | { kind: "event"; contractId: string; eventId: string };
}) {
  const form = useForwardForm();
  const { mutateAsync } = useForwardMutation(target);
  const { t } = useDictionary();
  const isEvent = target.kind === "event";
  const dialogStrings = t.contract.forwardDialog;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(isEvent ? t.contract.events.forwardSuccess : t.contract.forwardForm.success);
        form.reset();
        props.onOpenChange(false);
        props.onSuccess?.();
      },
      onError: () =>
        toast.error(isEvent ? t.contract.events.forwardError : t.contract.forwardForm.error),
    });
  });

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogStrings.title}</DialogTitle>
          <DialogDescription>{dialogStrings.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="forward-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEvent ? t.contract.events.subject : t.contract.forwardForm.subjectLabel}</FormLabel>
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
                  <FormLabel>
                    {isEvent ? t.contract.events.dueDate : t.contract.forwardForm.dueDateLabel}
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {isEvent ? t.contract.events.receiver : t.contract.forwardForm.receiverLabel}
                  </FormLabel>
                  <FormControl>
                    <UserSelect
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEvent ? t.contract.events.notes : t.contract.forwardForm.observationsLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {dialogStrings.cancel}
          </DialogClose>
          <Button type="submit" form="forward-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : dialogStrings.transfer}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
