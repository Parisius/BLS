"use client";

import { notFound } from "next/navigation";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilesSheet } from "@/components/shared/files-sheet";
import { IncidentDetailsTable } from "@/components/account-incident/incident-details-table";
import { IncidentPlanningModal } from "@/components/account-incident/incident-planning";
import { useOneIncident } from "@/lib/account-incident/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function IncidentDetailView({ incidentId }: { incidentId: string }) {
  const { data, isLoading, isError } = useOneIncident(incidentId);
  const { t } = useDictionary();
  const tf = t.accountIncident.files;

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
        <IncidentPlanningModal
          incidentId={data.id}
          reference={data.reference}
          currentTaskId={data.currentTask?.id}
        />
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
      <IncidentDetailsTable incident={data} />
    </>
  );
}
