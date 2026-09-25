"use client";

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
import { getFileIcon } from "@/lib/shared/icon-utils";

export interface FilesSheetLabels {
  title: string;
  noFiles: string;
  close: string;
}

/** Read-only archive of a record's uploaded files, as icons linking to the stored file. */
export function FilesSheet({
  trigger,
  children,
  description,
  files,
  labels,
}: {
  trigger: React.ReactElement;
  children: React.ReactNode;
  description?: string;
  files: { fileUrl: string; filename: string }[];
  labels: FilesSheetLabels;
}) {
  return (
    <Sheet>
      <SheetTrigger render={trigger}>{children}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
          <SheetDescription className="line-clamp-1">{description}</SheetDescription>
        </SheetHeader>
        {files.length > 0 ? (
          <div className="grid flex-1 grid-cols-3 gap-5 overflow-auto">
            {files.map(({ fileUrl, filename }) => (
              <a key={fileUrl} href={fileUrl} target="_blank" rel="noopener noreferrer">
                <span
                  style={{ backgroundImage: `url('/global/images/${getFileIcon(fileUrl)}')` }}
                  className="block h-20 bg-contain bg-center bg-no-repeat"
                />
                <span className="line-clamp-2 text-center">{filename}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex-1 text-center font-medium italic sm:text-lg">{labels.noFiles}</div>
        )}
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{labels.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
