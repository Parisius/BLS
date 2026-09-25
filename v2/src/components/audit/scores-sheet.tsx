"use client";

import { Fragment } from "react";
import { Eye, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AuditScore } from "@/lib/audit/audits";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Read-only view of one evaluation's scores. */
export function ScoresSheet({
  moduleTitle,
  evaluator,
  globalScore,
  scores,
}: {
  moduleTitle: string;
  evaluator: { firstname: string; lastname: string };
  globalScore?: number;
  scores: AuditScore[];
}) {
  const { t } = useDictionary();
  const ts = t.audit.scores;

  return (
    <Sheet>
      <Tooltip>
        <SheetTrigger
          render={
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" aria-label={t.audit.detail.viewScores} className="rounded-full" />}
            />
          }
        >
          <Eye size={30} />
        </SheetTrigger>
        <TooltipContent>{t.audit.detail.viewScores}</TooltipContent>
      </Tooltip>
      <SheetContent side="right" className="flex flex-col gap-5 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{moduleTitle}</SheetTitle>
          <SheetDescription className="line-clamp-1">
            {ts.evaluatedBy}{" "}
            <span className="italic">
              {evaluator.lastname} {evaluator.firstname}
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-10 overflow-auto py-2">
          <div className="relative flex flex-col gap-5 rounded-xl border-2 p-5">
            <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
              {ts.title}
            </span>
            {globalScore != null && (
              <span className="absolute right-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
                {ts.globalScore} {globalScore}
              </span>
            )}
            <div className="grid grid-cols-3 gap-5">
              <span className="col-span-2">{ts.criterion}</span>
              <span>{ts.score}</span>
              {scores.map(({ criteria, score }) => (
                <Fragment key={criteria.id}>
                  <div className="col-span-2 flex items-center gap-2">
                    <User className="flex-shrink-0" />
                    <span>{criteria.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag />
                    <span>
                      {score} / {criteria.maxScore}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{ts.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
