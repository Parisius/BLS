"use client";
import { useArchivedGeneralMeetings } from "@/services/api-sdk/models/general-meeting";
import GeneralMeetingCard from "@/components/governance/general-meeting/ui/general-meeting-card";
import { useSearchResults } from "@/providers/search-provider";
import { ArchivedGeneralMeetingListSuspense } from "./suspense";
import { FormattedMessage } from "react-intl";
export function ArchivedGeneralMeetingList() {
  const { data, isError } = useArchivedGeneralMeetings();
  const filteredData = useSearchResults(data ?? []);
  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (!data) {
    return <ArchivedGeneralMeetingListSuspense />;
  }
  if (data.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="generalMeeting.no_archived_session" />
      </p>
    );
  }
  if (filteredData.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="generalMeeting.no_archived_session_result" />
      </p>
    );
  }
  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {filteredData.map(({ id, title, reference, meetingDate, status }) => (
        <GeneralMeetingCard
          key={id}
          meetingId={id}
          title={title}
          reference={reference}
          meetingDate={meetingDate}
          status={status}
        />
      ))}
    </div>
  );
}
