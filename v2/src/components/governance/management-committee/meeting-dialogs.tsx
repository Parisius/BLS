"use client";

import { Can } from "@/components/auth/can";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMeetingForm, type MeetingFormValues } from "@/lib/governance/management-committee/forms";
import { useCreateMeeting, useUpdateMeeting } from "@/lib/governance/management-committee/hooks";
import type { Meeting } from "@/lib/governance/management-committee/meetings";
import { toDateInputValue } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

function MeetingFormFields({
  formId,
  form,
  onSubmit,
}: {
  formId: string;
  form: ReturnType<typeof useMeetingForm>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  const { t } = useDictionary();
  const tg = t.managementCommittee;

  return (
    <Form {...form}>
      <form id={formId} className="space-y-5" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tg.meetingForm.nameLabel}</FormLabel>
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
          name="meetingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tg.meetingForm.dateLabel}</FormLabel>
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

function AddMeetingDialogInner() {
  const form = useMeetingForm();
  const { mutateAsync } = useCreateMeeting();
  const router = useRouter();
  const { t } = useDictionary();
  const tg = t.managementCommittee;

  const handleSubmit = form.handleSubmit(async (values: MeetingFormValues) => {
    await mutateAsync(values, {
      onSuccess: (created) => {
        form.reset();
        router.push(`/dashboard/governance/management-committee/${created.id}`);
      },
      onError: () => toast.error(t.common.loadError),
    });
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button className="gap-2" />}>
        <CalendarPlus />
        {tg.hub.newMeetingCta}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.addMeetingDialog.title}</DialogTitle>
          <DialogDescription>{tg.addMeetingDialog.description}</DialogDescription>
        </DialogHeader>
        <MeetingFormFields formId="add-meeting-form" form={form} onSubmit={handleSubmit} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tg.addMeetingDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-meeting-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.addMeetingDialog.validate}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateMeetingDialog({
  meeting,
  open,
  onOpenChange,
}: {
  meeting: Meeting;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useMeetingForm();
  const { mutateAsync } = useUpdateMeeting(meeting.id);
  const { t } = useDictionary();
  const tg = t.managementCommittee;

  useEffect(() => {
    if (open) {
      form.reset({
        title: meeting.title,
        meetingDate: toDateInputValue(meeting.meetingDate),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, meeting]);

  const handleSubmit = form.handleSubmit(async (values: MeetingFormValues) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(t.common.create);
        onOpenChange(false);
      },
      onError: () => toast.error(t.common.loadError),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.addMeetingDialog.title}</DialogTitle>
          <DialogDescription>{tg.addMeetingDialog.description}</DialogDescription>
        </DialogHeader>
        <MeetingFormFields formId="update-meeting-form" form={form} onSubmit={handleSubmit} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.addMeetingDialog.cancel}
          </DialogClose>
          <Button type="submit" form="update-meeting-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.addMeetingDialog.validate}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddMeetingDialog() {
  return (
    <Can permission="governance.create">
      <AddMeetingDialogInner />
    </Can>
  );
}
