"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useArchiveLitigation } from "@/lib/litigation/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function ArchiveLitigationButton({ litigationId }: { litigationId: string }) {
  const { t } = useDictionary();
  const ta = t.litigation.archive;
  const { mutateAsync } = useArchiveLitigation(litigationId);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleArchive = async () => {
    setPending(true);
    try {
      await mutateAsync();
      toast.success(ta.success);
      setOpen(false);
    } catch {
      toast.error(ta.error);
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button type="button" className="gap-2 bg-secondary hover:bg-secondary/80" />}>
        <Archive />
        {ta.button}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ta.title}</AlertDialogTitle>
          <AlertDialogDescription>{ta.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">{ta.cancel}</AlertDialogCancel>
          <Button variant="destructive" disabled={pending} onClick={() => void handleArchive()}>
            {pending ? "..." : ta.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
