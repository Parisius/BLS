"use client";

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
import { Files } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFileIcon } from "@/lib/shared/icon-utils";
import type { Contract } from "@/lib/contract/contracts";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function ContractFilesModal({ contract }: { contract: Contract }) {
  const { t } = useDictionary();
  const tc = t.contract;

  return (
    <Sheet>
      <SheetTrigger render={<Button className="gap-2" />}>
        <Files />
        <span className="sr-only sm:not-sr-only">{tc.detailsPage.documents}</span>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>{tc.modal.archives}</SheetTitle>
          <SheetDescription className="line-clamp-1">{contract.title}</SheetDescription>
        </SheetHeader>

        {/* Base UI's Accordion has no Radix-style type="single"/collapsible
            props — `value` is just the array of currently-open items, so
            leaving it uncontrolled allows multiple sections open at once (a
            minor, harmless difference from the original's single-open
            behavior). */}
        {contract.filesGroups.length > 0 ? (
          <Accordion className="flex-1 space-y-5 overflow-auto">
            {contract.filesGroups.map((group) => (
              <AccordionItem key={group.stepName} value={group.stepName} className="border-none">
                <AccordionTrigger className="border px-4">{group.stepName}</AccordionTrigger>
                <AccordionContent className="bg-card py-4">
                  {group.files.length > 0 ? (
                    <div className="grid grid-cols-3 gap-5">
                      {group.files.map((file) => (
                        <a key={file.fileUrl} href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                          <span
                            style={{ backgroundImage: `url('/global/images/${getFileIcon(file.fileUrl)}')` }}
                            className="block h-20 bg-contain bg-center bg-no-repeat"
                          />
                          <span className="line-clamp-2 text-center">{file.filename}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center font-medium italic sm:text-lg">
                      {tc.modal.noFilesStep}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex-1 text-center font-medium italic sm:text-lg">{tc.modal.noFilesFolder}</div>
        )}

        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{tc.modal.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
