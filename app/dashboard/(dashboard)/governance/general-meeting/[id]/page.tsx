"use client";
import {
  BookOpenCheck,
  EllipsisVertical,
  Files,
  GanttChart,
  LayoutList,
  ListChecks,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AttendantsDialog from "@/components/governance/general-meeting/modals/attendants-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChecklistModal from "@/components/governance/general-meeting/modals/checklist-modal";
import GeneralMeetingFilesModal from "@/components/governance/general-meeting/modals/general-meeting-files-modal";
import GeneralMeetingTimelineModal from "@/components/governance/general-meeting/modals/general-meeting-timeline-modal";
import { GeneralMeetingDetailsPageBreadcrumb } from "@/components/governance/general-meeting/breadcrumbs";
import { useOneGeneralMeeting } from "@/services/api-sdk/models/general-meeting";
import { notFound } from "next/navigation";
import { GeneralMeetingDetailsTable } from "@/components/governance/general-meeting/tables/general-meeting-details-table";
import ProcedureModal from "@/components/governance/general-meeting/modals/procedure-modal";
import GeneralMeetingDetailsPageLoading from "./loading";
import { FormattedMessage } from "react-intl";
export default function Page({ params: { id } }) {
  const { data, isLoading, isError } = useOneGeneralMeeting(id);
  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (isLoading) {
    return <GeneralMeetingDetailsPageLoading />;
  }
  if (!data) {
    notFound();
  }
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <GeneralMeetingDetailsPageBreadcrumb meetingTitle={data.title} />
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data.title}
      </h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <GeneralMeetingTimelineModal
          asChild
          meetingId={data.id}
          meetingDate={data.meetingDate}
          meetingTitle={data.title}
        >
          <Button aria-label="Planification de l'AG" className="gap-2">
            <GanttChart />
            <FormattedMessage
              id="generalMeeting.general_meeting_currentMeeting_view_plan"
              defaultMessage="Plan"
            />
          </Button>
        </GeneralMeetingTimelineModal>

        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger asChild className="cursor-pointer sm:hidden">
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Menu"
                  className="gap-2 rounded-full"
                >
                  <EllipsisVertical size={30} />
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>Menu</TooltipContent>
          </Tooltip>
          <DropdownMenuContent>
            <AttendantsDialog asChild meetingId={id}>
              <DropdownMenuItem
                className="cursor-pointer gap-2 sm:hidden"
                onSelect={(e) => e.preventDefault()}
              >
                <Users />
                <FormattedMessage
                  id="generalMeeting.general_meeting_currentMeeting_view_createAttendantsList"
                  defaultMessage="Create attendance list"
                />
              </DropdownMenuItem>
            </AttendantsDialog>
            <ChecklistModal asChild meetingId={id}>
              <DropdownMenuItem
                className="cursor-pointer gap-2 sm:hidden"
                onSelect={(e) => e.preventDefault()}
              >
                <ListChecks />
                <FormattedMessage
                  id="generalMeeting.general_meeting_currentMeeting_view_checklist"
                  defaultMessage="Checklist"
                />
              </DropdownMenuItem>
            </ChecklistModal>
            <ProcedureModal asChild meetingId={id}>
              <DropdownMenuItem
                className="cursor-pointer gap-2 sm:hidden"
                onSelect={(e) => e.preventDefault()}
              >
                <LayoutList />
                <FormattedMessage
                  id="generalMeeting.general_meeting_currentMeeting_view_procedures"
                  defaultMessage="Procedures"
                />
              </DropdownMenuItem>
            </ProcedureModal>
            <GeneralMeetingFilesModal
              asChild
              meetingId={id}
              meetingTitle={data.title}
            >
              <DropdownMenuItem
                className="cursor-pointer gap-2 sm:hidden"
                onSelect={(e) => e.preventDefault()}
              >
                <Files />
                Archives
              </DropdownMenuItem>
            </GeneralMeetingFilesModal>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center justify-between gap-2 sm:flex">
          <AttendantsDialog asChild meetingId={id}>
            <Button variant="secondary" className="gap-2">
              <Users />
              <FormattedMessage
                id="generalMeeting.general_meeting_currentMeeting_view_createAttendantsList"
                defaultMessage="Create attendance list"
              />
            </Button>
          </AttendantsDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <BookOpenCheck />
                <FormattedMessage
                  id="generalMeeting.general_meeting_currentMeeting_view_holdMeeting"
                  defaultMessage="Hold meeting"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <ChecklistModal asChild meetingId={id}>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onSelect={(e) => e.preventDefault()}
                >
                  <ListChecks />
                  Checklist
                </DropdownMenuItem>
              </ChecklistModal>

              <ProcedureModal asChild meetingId={id}>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LayoutList />
                  <FormattedMessage
                    id="generalMeeting.general_meeting_currentMeeting_view_procedures"
                    defaultMessage="Procedures"
                  />
                </DropdownMenuItem>
              </ProcedureModal>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <GeneralMeetingFilesModal
              asChild
              meetingId={id}
              meetingTitle={data.title}
            >
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Archives"
                  className="gap-2 rounded-full"
                >
                  <Files size={30} />
                </Button>
              </TooltipTrigger>
            </GeneralMeetingFilesModal>
            <TooltipContent>Archives</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <GeneralMeetingDetailsTable
        id={id}
        title={data.title}
        reference={data.reference}
        status={data.status}
        meetingDate={data.meetingDate}
        meetingType={data.meetingType}
        nextTask={data.nextTask}
      />
    </div>
  );
}
