"use client";

import { use } from "react";
import Link from "next/link";
import { Component } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useOneMeeting } from "@/lib/governance/general-meeting/hooks";
import { MeetingDetailsTable } from "@/components/governance/general-meeting/meeting-details-table";
import { MeetingTasksTimelineModal } from "@/components/governance/general-meeting/meeting-tasks-timeline-modal";
import { ChecklistDialog } from "@/components/governance/general-meeting/checklist-dialog";
import { AttendantsDialog } from "@/components/governance/general-meeting/attendants-dialog";
import { MeetingFilesModal } from "@/components/governance/general-meeting/meeting-files-modal";
import { useDictionary } from "@/lib/i18n/locale-provider";

export default function GeneralMeetingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: meetingId } = use(params);
  const { data: meeting, isLoading, isError } = useOneMeeting(meetingId);
  const { t } = useDictionary();
  const tg = t.generalMeeting;

  if (isError) {
    return <p className="text-center text-destructive">{t.common.loadError}</p>;
  }

  if (isLoading || !meeting) {
    return (
      <div className="container flex flex-1 flex-col gap-10 py-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/modules" />}>
              <Component />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/governance" />}>
              {tg.breadcrumb.governance}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/governance/general-meeting" />}>
              {tg.breadcrumb.generalMeeting}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{meeting.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{meeting.title}</h1>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <MeetingTasksTimelineModal meetingId={meeting.id} />
        <ChecklistDialog meetingId={meeting.id} type="checklist" />
        <ChecklistDialog meetingId={meeting.id} type="procedure" />
        <AttendantsDialog meetingId={meeting.id} />
        <MeetingFilesModal meeting={meeting} />
      </div>

      <MeetingDetailsTable meeting={meeting} />
    </div>
  );
}
