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
import type { Score } from "@/lib/shared/scores";

export interface ScoresSheetLabels {
  view: string;
  title: string;
  globalScore: string;
  criterion: string;
  score: string;
  evaluatedBy: string;
  close: string;
}

/** Read-only view of one evaluation's scores. */
export function ScoresSheet({
  moduleTitle,
  evaluator,
  globalScore,
  scores,
  labels: ts,
}: {
  labels: ScoresSheetLabels;
  moduleTitle: string;
  evaluator: { firstname: string; lastname: string };
  globalScore?: number;
  scores: Score[];
}) {
  return (
    <Sheet>
      <Tooltip>
        <SheetTrigger
          render={
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" aria-label={ts.view} className="rounded-full" />}
            />
          }
        >
          <Eye size={30} />
        </SheetTrigger>
        <TooltipContent>{ts.view}</TooltipContent>
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
