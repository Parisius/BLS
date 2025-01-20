"use client";
import { useArchivedAdministrationMeetings } from "@/services/api-sdk/models/administration-meeting";
import AdministrationMeetingCard from "@/components/governance/administration-meeting/ui/administration-meeting-card";
import { useSearchResults } from "@/providers/search-provider";
import { ArchivedAdministrationMeetingListSuspense } from "./suspense";
import { FormattedMessage } from "react-intl";
export function ArchivedAdministrationMeetingList() {
  const { data, isError } = useArchivedAdministrationMeetings();
  const filteredData = useSearchResults(data ?? []);
  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (!data) {
    return <ArchivedAdministrationMeetingListSuspense />;
  }
  if (data.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="sessionAdministrator.no_meetings_found" />
      </p>
    );
  }
  if (filteredData.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="sessionAdministrator.no_search_results" />
      </p>
    );
  }
  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {filteredData.map(({ id, title, reference, meetingDate, status }) => (
        <AdministrationMeetingCard
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
