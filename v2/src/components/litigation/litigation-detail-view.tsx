"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilesSheet } from "@/components/shared/files-sheet";
import { ArchiveLitigationButton } from "@/components/litigation/archive-litigation-button";
import { AssignCollaboratorsDialog } from "@/components/litigation/assign-collaborators-dialog";
import { LitigationDetailsTable } from "@/components/litigation/litigation-details-table";
import { UpdateLitigationDialog } from "@/components/litigation/litigation-dialogs";
import { LitigationPlanningModal } from "@/components/litigation/litigation-planning";
import { PartiesSheet } from "@/components/litigation/parties-sheet";
import { UpdateProvisionsDialog } from "@/components/litigation/provisions-dialogs";
import { useOneLitigation } from "@/lib/litigation/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function LitigationDetailView({ litigationId }: { litigationId: string }) {
  const { data, isLoading, isError } = useOneLitigation(litigationId);
  const { t } = useDictionary();
  const tl = t.litigation;
  const [editing, setEditing] = useState(false);
  const [assigning, setAssigning] = useState(false);

  if (isError) return <p className="text-center text-destructive">{t.common.loadError}</p>;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (!data) notFound();

  return (
    <>
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{data.title}</h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LitigationPlanningModal litigationId={data.id} reference={data.reference} nextStepId={data.nextStep?.id} />
          {data.hasProvisions && <UpdateProvisionsDialog litigation={data} />}
        </div>
        <div className="flex items-center gap-2">
          {!data.isArchived && <ArchiveLitigationButton litigationId={data.id} />}
          <FilesSheet
            trigger={<Button className="gap-2" />}
            description={data.title}
            files={data.files}
            labels={{ title: tl.files.archives, noFiles: tl.files.noFiles, close: tl.files.close }}
          >
            <Files />
            <span className="sr-only sm:not-sr-only">{tl.details.documents}</span>
          </FilesSheet>
          <PartiesSheet litigation={data} onEdit={() => setEditing(true)} />
        </div>
      </div>
      <LitigationDetailsTable litigation={data} onAssign={() => setAssigning(true)} onEdit={() => setEditing(true)} />
      <UpdateLitigationDialog litigationId={data.id} open={editing} onOpenChange={setEditing} />
      <AssignCollaboratorsDialog litigationId={data.id} open={assigning} onOpenChange={setAssigning} />
    </>
  );
}
