"use client";

import { Can } from "@/components/auth/can";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Group } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useCreateProfile, useDeleteProfile, useUpdateProfile } from "@/lib/evaluation/hooks";
import { useProfileForm } from "@/lib/evaluation/forms";
import type { Profile } from "@/lib/evaluation/profiles";
import { useDictionary } from "@/lib/i18n/locale-provider";

function ProfileFormBody({
  profile,
  onDone,
  formId,
}: {
  profile?: Profile;
  onDone: () => void;
  formId: string;
}) {
  const { t } = useDictionary();
  const tp = t.evaluation.profiles;
  const form = useProfileForm(profile ? { title: profile.title } : undefined);
  const { mutateAsync: create } = useCreateProfile();
  const { mutateAsync: update } = useUpdateProfile();

  const handleSubmit = form.handleSubmit(async ({ title }) => {
    try {
      if (profile) await update({ profileId: profile.id, title });
      else await create({ title });
      toast.success(profile ? tp.editSuccess : tp.addSuccess);
      form.reset({ title: profile ? title : "" });
      onDone();
    } catch {
      toast.error(profile ? tp.editError : tp.addError);
    }
  });

  return (
    <>
      <Form {...form}>
        <form id={formId} noValidate className="space-y-5" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tp.titleLabel}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={tp.titleLabel} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter className="gap-2">
        <DialogClose render={<Button type="button" variant="destructive" />}>{tp.cancel}</DialogClose>
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "..." : profile ? tp.editSubmit : tp.addSubmit}
        </Button>
      </DialogFooter>
    </>
  );
}

function AddProfileDialogInner() {
  const { t } = useDictionary();
  const tp = t.evaluation.profiles;
  const formId = useId();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Group />
        <span className="sr-only sm:not-sr-only">{t.evaluation.profilesPage.newProfile}</span>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tp.addTitle}</DialogTitle>
          <DialogDescription>{tp.addDescription}</DialogDescription>
        </DialogHeader>
        <ProfileFormBody formId={formId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

/** Controlled: opened from a profile card. */
export function EditProfileDialog({
  profile,
  onOpenChange,
}: {
  profile: Profile | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tp = t.evaluation.profiles;
  const formId = useId();

  return (
    <Dialog open={!!profile} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tp.editTitle}</DialogTitle>
          <DialogDescription>{tp.editDescription}</DialogDescription>
        </DialogHeader>
        {/* Keyed so the form starts from the profile's current title each time. */}
        {profile && <ProfileFormBody key={profile.id} profile={profile} formId={formId} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

export function DeleteProfileDialog({
  profile,
  onOpenChange,
}: {
  profile: Profile | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tp = t.evaluation.profiles;
  const { mutateAsync } = useDeleteProfile();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!profile) return;
    setPending(true);
    try {
      await mutateAsync(profile.id);
      toast.success(tp.deleteSuccess);
      onOpenChange(false);
    } catch {
      toast.error(tp.deleteError);
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={!!profile} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tp.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{tp.deleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">{tp.cancel}</AlertDialogCancel>
          <Button variant="destructive" disabled={pending} onClick={() => void handleDelete()}>
            {pending ? "..." : tp.deleteConfirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AddProfileDialog() {
  return (
    <Can permission="evaluation.manage_profiles">
      <AddProfileDialogInner />
    </Can>
  );
}
