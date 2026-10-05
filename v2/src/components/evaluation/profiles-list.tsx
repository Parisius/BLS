"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, RotateCw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CriteriaManager } from "@/components/shared/criteria-manager";
import { CollaboratorsManager } from "@/components/evaluation/collaborators-manager";
import { DeleteProfileDialog, EditProfileDialog } from "@/components/evaluation/profile-dialogs";
import {
  useAllEvaluationCriteria,
  useAllProfiles,
  useCreateEvaluationCriteria,
  useDeleteEvaluationCriteria,
  useUpdateEvaluationCriteria,
} from "@/lib/evaluation/hooks";
import type { Profile } from "@/lib/evaluation/profiles";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

function ProfileCriteria({ profileId, label }: { profileId: string; label: string }) {
  const { t } = useDictionary();
  const { data, isLoading, isError } = useAllEvaluationCriteria({ profileId });
  const { mutateAsync: create } = useCreateEvaluationCriteria(profileId);
  const { mutateAsync: update } = useUpdateEvaluationCriteria(profileId);
  const { mutateAsync: remove } = useDeleteEvaluationCriteria();

  return (
    <CriteriaManager
      label={label}
      labels={t.evaluation.criteria}
      typeLabels={t.evaluation.criteriaTypes}
      errorLabel={t.common.loadError}
      criteria={data}
      isLoading={isLoading}
      isError={isError}
      onCreate={create}
      onUpdate={(id, values) => update({ criteriaId: id, args: values })}
      onDelete={remove}
    />
  );
}

function ManageProfileDialog({
  profiles,
  profileId,
  onProfileChange,
}: {
  profiles: Profile[];
  /** Null when closed. */
  profileId: string | null;
  onProfileChange: (profileId: string | null) => void;
}) {
  const { t } = useDictionary();
  const tm = t.evaluation.manageProfile;
  const items = useMemo(() => profiles.map((profile) => ({ value: profile.id, label: profile.title })), [profiles]);

  return (
    <Dialog open={!!profileId} onOpenChange={(open) => !open && onProfileChange(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{tm.title}</DialogTitle>
          <DialogDescription>{tm.description}</DialogDescription>
        </DialogHeader>
        {profileId && (
          <div className="-mx-4 max-h-[70vh] space-y-10 overflow-auto px-4 py-2">
            <div className="space-y-2">
              <Label>{tm.profile}</Label>
              <Select value={profileId} items={items} onValueChange={(next) => next && onProfileChange(next)}>
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder={tm.selectProfile} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ProfileCriteria key={`criteria-${profileId}`} profileId={profileId} label={tm.criteria} />
            <CollaboratorsManager key={`collaborators-${profileId}`} profileId={profileId} label={tm.collaborators} />
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tm.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProfilesList() {
  const { data, isLoading, isError, refetch } = useAllProfiles();
  const { t } = useDictionary();
  const tp = t.evaluation.profilesPage;
  const [managing, setManaging] = useState<string | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState<Profile | null>(null);

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-5">
        <p className="text-center text-lg italic text-secondary-foreground/75">{t.common.loadError}</p>
        <Button className="gap-2" onClick={() => void refetch()}>
          <RotateCw />
          {tp.retry}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid auto-rows-fr gap-10 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20 flex-1" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-center text-lg italic text-foreground/75">{tp.noItems}</p>;
  }

  return (
    <>
      <div className="grid auto-rows-fr gap-10 sm:grid-cols-2 md:grid-cols-3">
        {data.map((profile) => (
          <Card key={profile.id} className="h-full bg-primary text-primary-foreground">
            <CardHeader className="h-full items-center justify-center gap-4">
              <CardTitle className="text-center">{profile.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Can permission="evaluation.manage_profiles">
                  <Button variant="ghost" size="icon" aria-label={tp.view} className="bg-accent/50" onClick={() => setManaging(profile.id)}>
                    <Eye />
                  </Button>
                </Can>
                <Can permission="evaluation.manage_profiles">
                  <Button variant="ghost" size="icon" aria-label={tp.edit} className="bg-accent/50" onClick={() => setEditing(profile)}>
                    <Pencil />
                  </Button>
                </Can>
                <Can permission="evaluation.manage_profiles">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={tp.delete}
                    className="bg-accent/50 text-destructive"
                    onClick={() => setDeleting(profile)}
                  >
                    <Trash />
                  </Button>
                </Can>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <ManageProfileDialog profiles={data} profileId={managing} onProfileChange={setManaging} />
      <EditProfileDialog profile={editing} onOpenChange={(open) => !open && setEditing(null)} />
      <DeleteProfileDialog profile={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </>
  );
}
