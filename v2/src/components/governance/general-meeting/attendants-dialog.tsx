"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useAllAttendants,
  useAddAttendant,
  useUpdateAttendant,
  useDeleteAttendant,
  useUpdateAttendance,
} from "@/lib/governance/general-meeting/hooks";
import { useAttendantForm } from "@/lib/governance/general-meeting/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Attendant } from "@/lib/governance/general-meeting/attendance";

function AddAttendantDialog({ meetingId }: { meetingId: string }) {
  const form = useAttendantForm();
  const { mutateAsync } = useAddAttendant(meetingId);
  const { t } = useDictionary();
  const tg = t.generalMeeting;
  const [open, setOpen] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
      onError: () => toast.error(t.common.loadError),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-2" />}>
        <Plus />
        {tg.attendantsTable.addAttendant}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.addAttendantDialog.title}</DialogTitle>
          <DialogDescription>{tg.addAttendantDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-attendant-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.addAttendantDialog.nameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.addAttendantDialog.qualityLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tg.addAttendantDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-attendant-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.addAttendantDialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateAttendantDialog({
  meetingId,
  attendant,
  open,
  onOpenChange,
}: {
  meetingId: string;
  attendant: Attendant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useAttendantForm(attendant ? { name: attendant.name, grade: attendant.grade } : undefined);
  const { mutateAsync } = useUpdateAttendant(meetingId);
  const { t } = useDictionary();
  const tg = t.generalMeeting;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!attendant) return;
    await mutateAsync(
      { attendantId: attendant.id, ...values },
      { onSuccess: () => onOpenChange(false), onError: () => toast.error(t.common.loadError) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.updateAttendantDialog.title}</DialogTitle>
          <DialogDescription>{tg.updateAttendantDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="update-attendant-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.addAttendantDialog.nameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.addAttendantDialog.qualityLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.addAttendantDialog.cancel}
          </DialogClose>
          <Button type="submit" form="update-attendant-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.addAttendantDialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AttendantsTable({ meetingId }: { meetingId: string }) {
  const { data, isLoading } = useAllAttendants(meetingId);
  const { mutateAsync: updateAttendance } = useUpdateAttendance(meetingId);
  const { mutateAsync: deleteAttendant } = useDeleteAttendant(meetingId);
  const { t } = useDictionary();
  const tg = t.generalMeeting;

  const [updating, setUpdating] = useState<Attendant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleAttending = async (attendant: Attendant, attending: boolean) => {
    await updateAttendance(
      (data ?? []).map((a) => (a.id === attendant.id ? { ...a, attending } : a)),
      { onError: () => toast.error(t.common.loadError) },
    );
  };

  if (isLoading) return <p>{tg.attendantsTable.loading}</p>;
  if (!data || data.length === 0) return <p className="italic">{tg.attendantsTable.noAttendantsFound}</p>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>{tg.attendantsTable.name}</TableHead>
            <TableHead>{tg.attendantsTable.quality}</TableHead>
            <TableHead className="text-end">{tg.attendantsTable.addAttendant}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((attendant) => (
            <TableRow key={attendant.id}>
              <TableCell>
                <Checkbox
                  checked={attendant.attending}
                  onCheckedChange={(checked) => toggleAttending(attendant, !!checked)}
                />
              </TableCell>
              <TableCell>{attendant.name}</TableCell>
              <TableCell>
                {attendant.type === "shareholder" ? tg.attendantsTable.shareholderType : attendant.grade}
              </TableCell>
              <TableCell className="text-end">
                {attendant.type === "not_shareholder" && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => setUpdating(attendant)}>
                      <UserPlus />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeletingId(attendant.id)}
                    >
                      <Trash />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UpdateAttendantDialog
        key={updating?.id ?? "none"}
        meetingId={meetingId}
        attendant={updating}
        open={!!updating}
        onOpenChange={(open) => !open && setUpdating(null)}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tg.deleteAttendantDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{tg.deleteAttendantDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tg.addAttendantDialog.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deletingId) await deleteAttendant(deletingId);
                setDeletingId(null);
              }}
            >
              {tg.attendantsTable.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function AttendantsDialog({ meetingId }: { meetingId: string }) {
  const { t } = useDictionary();
  const tg = t.generalMeeting;

  return (
    <Dialog>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Users />
        {tg.currentMeetingView.createAttendantsList}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>{tg.attendantsDialog.title}</DialogTitle>
          <DialogDescription>{tg.attendantsDialog.description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <AddAttendantDialog meetingId={meetingId} />
        </div>

        <div className="flex-1 overflow-auto">
          <AttendantsTable meetingId={meetingId} />
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tg.attendantsDialog.cancel}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
