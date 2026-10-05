"use client";

import { notFound } from "next/navigation";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilesSheet } from "@/components/shared/files-sheet";
import { SafetyDetailsTable } from "@/components/safety/safety-details-table";
import { SafetyPlanningModal } from "@/components/safety/safety-planning";
import { StartRealisationButton } from "@/components/safety/start-realisation-button";
import { useOneGuarantee } from "@/lib/safety/hooks";
import { KIND_KEY, type SafetyKind } from "@/lib/safety/kinds";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

export function SafetyDetailView({ kind, guaranteeId }: { kind: SafetyKind; guaranteeId: string }) {
  const { data, isLoading, isError } = useOneGuarantee(guaranteeId);
  const { t } = useDictionary();
  const tk = t.safety.kinds[KIND_KEY[kind]];
  const tf = t.safety.files;

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
        <SafetyPlanningModal kind={kind} guaranteeId={data.id} reference={data.reference} nextStepId={data.nextStep?.id} />
        <div className="flex items-center gap-2">
          {/* The original only offered this for mortgages, and checked "formalization" (not yet formalized) for the other two. */}
          {data.hasRecovery && data.phase === "formalized" && (
            <Can permission="guarantee.start_realisation">
              <StartRealisationButton guaranteeId={data.id} />
            </Can>
          )}
          <Tooltip>
            <FilesSheet
              trigger={
                <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={tf.title} className="gap-2 rounded-full" />} />
              }
              description={data.title}
              files={data.files}
              labels={{ ...tf, noFiles: tk.files }}
            >
              <Files size={30} />
            </FilesSheet>
            <TooltipContent>{tf.title}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <SafetyDetailsTable kind={kind} guarantee={data} />
    </>
  );
}
