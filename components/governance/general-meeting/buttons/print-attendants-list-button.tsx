"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveAs } from "file-saver";
import { usePrintMeetingAttendantsList } from "@/services/api-sdk/models/general-meeting";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
export default function PrintAttendantsListButton({
  meetingId,
  className,
  children,
  ...props
}: {
  className?: string;
  meetingId: string;
  children;
}) {
  const form = useForm();
  const { mutateAsync } = usePrintMeetingAttendantsList(meetingId);
  const handlePrint = useCallback(async () => {
    await mutateAsync({
      onSuccess: ({ buffer, filename }) => {
        saveAs(new Blob([new Uint8Array(buffer)]), filename);
      },
      onError: () => {
        toast({
          description:
            "Une erreur s'est produite lors de l'impression de la liste des participants.",
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });
  }, [mutateAsync]);
  return (
    <form className="contents" onSubmit={form.handleSubmit(handlePrint)}>
      <Button
        {...props}
        type="submit"
        disabled={form.formState.isSubmitting}
        className={className}
      >
        {form.formState.isSubmitting ? <EllipsisLoader /> : children}
      </Button>
    </form>
  );
}
