"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Archive, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFileIcon } from "@/lib/shared/icon-utils";
import { useAddMeetingFile } from "@/lib/governance/general-meeting/hooks";
import type { MeetingFileType } from "@/lib/governance/general-meeting/files";
import type { Meeting } from "@/lib/governance/general-meeting/meetings";
import { useDictionary } from "@/lib/i18n/locale-provider";

const FILE_TYPES: MeetingFileType[] = ["convocation", "agenda", "pv", "attendance_list", "other"];

export function MeetingFilesModal({ meeting }: { meeting: Meeting }) {
  const { t } = useDictionary();
  const tg = t.generalMeeting;
  const { mutateAsync, isPending } = useAddMeetingFile(meeting.id);
  const [fileType, setFileType] = useState<MeetingFileType>("other");
  const inputRef = useRef<HTMLInputElement>(null);

  const files = meeting.filesGroups.flatMap((group) => group.files);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await mutateAsync(
      { file, type: fileType },
      {
        onSuccess: () => toast.success(t.common.create),
        onError: () => toast.error(t.common.loadError),
      },
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Sheet>
      <SheetTrigger render={<Button className="gap-2" />}>
        <Archive />
        {tg.currentMeetingView.archives}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>{tg.currentMeetingView.archives}</SheetTitle>
          <SheetDescription className="line-clamp-1">{meeting.title}</SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-2">
          <Select
            value={fileType}
            onValueChange={(v) => setFileType(v as MeetingFileType)}
            items={FILE_TYPES.map((type) => ({
              value: type,
              label: tg.fileType[type === "attendance_list" ? "attendanceList" : type],
            }))}
          >
            <SelectTrigger className="h-10 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {tg.fileType[type === "attendance_list" ? "attendanceList" : type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" disabled={isPending} onClick={() => inputRef.current?.click()}>
            <Plus />
          </Button>
          <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
        </div>

        {files.length === 0 ? (
          <div className="flex-1 text-center font-medium italic sm:text-lg">{tg.archivesSheet.noFiles}</div>
        ) : (
          <div className="grid flex-1 grid-cols-3 gap-5 overflow-auto">
            {files.map((file) => (
              <a key={file.fileUrl} href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                <span
                  style={{ backgroundImage: `url('/global/images/${getFileIcon(file.fileUrl)}')` }}
                  className="block h-20 bg-contain bg-center bg-no-repeat"
                />
                <span className="line-clamp-2 text-center">{file.filename}</span>
              </a>
            ))}
          </div>
        )}

        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{tg.timelineModal.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
