"use client";

import { notFound } from "next/navigation";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilesSheet } from "@/components/shared/files-sheet";
import { RecoveryDetailsTable } from "@/components/recovery/recovery-details-table";
import { RecoveryPlanningModal } from "@/components/recovery/recovery-planning";
import { useOneRecovery } from "@/lib/recovery/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function RecoveryDetailView({ recoveryId }: { recoveryId: string }) {
  const { data, isLoading, isError } = useOneRecovery(recoveryId);
  const { t } = useDictionary();
  const tf = t.recovery.files;

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
        <RecoveryPlanningModal recoveryId={data.id} reference={data.reference} nextStepId={data.nextStep?.id} />
        <Tooltip>
          <FilesSheet
            trigger={
              <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={tf.title} className="gap-2 rounded-full" />} />
            }
            description={data.title}
            files={data.files}
            labels={tf}
          >
            <Files size={30} />
          </FilesSheet>
          <TooltipContent>{tf.title}</TooltipContent>
        </Tooltip>
      </div>
      <RecoveryDetailsTable recovery={data} />
    </>
  );
}
