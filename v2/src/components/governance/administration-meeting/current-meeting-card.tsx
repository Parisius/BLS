"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllMeetings } from "@/lib/governance/administration-meeting/hooks";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { AddMeetingDialog } from "@/components/governance/administration-meeting/meeting-dialogs";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CurrentMeetingCard() {
  const { data, isLoading } = useAllMeetings("pending");
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
  const meeting = data?.[0];

  if (isLoading) {
    return <Skeleton className="mx-auto h-64 w-full max-w-lg" />;
  }

  if (!meeting) {
    return (
      <Card className="mx-auto w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle>{tg.hub.ongoingPreparationTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <AddMeetingDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{tg.hub.ongoingPreparation}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>
          <span className="font-semibold">{tg.hub.reference}:</span> {meeting.reference ?? "-"}
        </p>
        <p>
          <span className="font-semibold">{tg.hub.meetingDate}:</span>{" "}
          {meeting.meetingDate ? formatDisplayDate(meeting.meetingDate) : "-"}
        </p>
        <p>
          <span className="font-semibold">{tg.hub.nextTask}:</span>{" "}
          {meeting.nextTask?.title ?? tg.hub.noTaskPending}
        </p>
        <p>
          <span className="font-semibold">{tg.hub.nextDeadline}:</span>{" "}
          {meeting.nextTask?.dueDate ? formatDisplayDate(meeting.nextTask.dueDate) : tg.hub.noDeadlinePending}
        </p>
        <Button className="w-full" render={<Link href={`/dashboard/governance/administration-meeting/${meeting.id}`} />}>
          {tg.hub.seeDetails}
        </Button>
      </CardContent>
    </Card>
  );
}
