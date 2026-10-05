"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Pencil, Printer } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/legal-monitoring/items-lists";
import { UpdateJudicialDialog } from "@/components/legal-monitoring/judicial-form";
import { UpdateLegislativeDialog } from "@/components/legal-monitoring/legislative-form";
import { useOneLegalItem, usePrintLegalItem } from "@/lib/legal-monitoring/hooks";
import { downloadBytes } from "@/lib/shared/download";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

export function ItemDetailView({ kind, itemId }: { kind: "judicial" | "legislative"; itemId: string }) {
  const { t } = useDictionary();
  const td = t.legalMonitoring.detail;
  const { data, isLoading, isError } = useOneLegalItem(itemId);
  const { mutate: print, isPending: printing } = usePrintLegalItem();
  const [editing, setEditing] = useState(false);
  const judicial = kind === "judicial";

  if (isError) return <p className="text-center text-destructive">{t.common.loadError}</p>;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (!data) notFound();

  const date = judicial ? data.eventDate : data.effectiveDate;
  const columns: [string, React.ReactNode][] = [
    [td.title, data.title],
    ...(judicial ? [] : ([[td.caseNumber, data.caseNumber ?? "-"]] as [string, React.ReactNode][])),
    [td.reference, data.reference],
    ...(judicial
      ? []
      : ([
          [td.type, data.type === "regulation" ? t.legalMonitoring.legislativeList.regulation : t.legalMonitoring.legislativeList.legislation],
        ] as [string, React.ReactNode][])),
    [judicial ? td.decisionDate : td.effectiveDate, date ? formatDisplayDate(date) : "-"],
    ...(judicial
      ? ([
          [td.jurisdiction, data.jurisdiction?.title ?? "-"],
          [td.jurisdictionLocation, data.jurisdictionLocation ?? "-"],
        ] as [string, React.ReactNode][])
      : ([[td.nature, data.nature?.title ?? "-"]] as [string, React.ReactNode][])),
    [td.mail, data.mail?.subject || "-"],
    [td.status, <StatusBadge key="status" isArchived={data.isArchived} />],
  ];

  return (
    <>
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{data.title}</h1>

      <Table className="border">
        <TableHeader>
          <TableRow>
            {columns.map(([label]) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-card">
            {columns.map(([label, value]) => (
              <TableCell key={label}>{value}</TableCell>
            ))}
            <TableCell className="whitespace-nowrap">
              <Can permission="legal_watch.update">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={td.edit}
                        className="rounded-full"
                        onClick={() => setEditing(true)}
                      />
                    }
                  >
                    <Pencil />
                  </TooltipTrigger>
                  <TooltipContent>{td.edit}</TooltipContent>
                </Tooltip>
              </Can>
              <Can permission="legal_watch.print">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={td.print}
                        className="rounded-full"
                        disabled={printing}
                        onClick={() =>
                          print(data.id, {
                            onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
                            onError: () => toast.error(td.printError),
                          })
                        }
                      />
                    }
                  >
                    <Printer className={printing ? "animate-bounce" : undefined} />
                  </TooltipTrigger>
                  <TooltipContent>{td.print}</TooltipContent>
                </Tooltip>
              </Can>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Accordion className="contents">
        {(
          [
            ["summary", judicial ? td.judicialSummary : td.legislativeSummary, data.summary],
            ["innovation", td.innovation, data.innovation],
          ] as const
        ).map(([value, label, text]) => (
          <AccordionItem key={value} value={value} className="border">
            <AccordionTrigger className="px-4">{label}</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line bg-card p-4">{text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {judicial ? (
        <UpdateJudicialDialog itemId={data.id} open={editing} onOpenChange={setEditing} />
      ) : (
        <UpdateLegislativeDialog itemId={data.id} open={editing} onOpenChange={setEditing} />
      )}
    </>
  );
}
