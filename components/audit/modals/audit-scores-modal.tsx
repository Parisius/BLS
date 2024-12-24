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
import { Button } from "@/components/ui/button";
import React from "react";
import AuditScoresView from "@/components/audit/ui/audit-scores-view";
export default function AuditScoresModal({
  moduleTitle,
  evaluator,
  globalScore,
  scores,
  ...props
}) {
  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl"
      >
        <SheetHeader>
          <div className="sm:flex sm:items-center sm:justify-between">
            <SheetTitle>{moduleTitle}</SheetTitle>
          </div>
          <SheetDescription className="line-clamp-1">
            Evalué par{" "}
            <span className="italic">
              {evaluator.lastname} {evaluator.firstname}
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-10 overflow-auto py-2">
          <AuditScoresView
            label="Notes"
            globalScore={globalScore}
            scores={scores}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">Fermer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
