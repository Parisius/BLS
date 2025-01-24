"use client";
import { useArchivedManagementCommittees } from "@/services/api-sdk/models/management-committee";
import ManagementCommitteeCard from "@/components/governance/management-committee/ui/management-committee-card";
import { useSearchResults } from "@/providers/search-provider";
import { ArchivedManagementCommitteeListSuspense } from "./suspense";
import { FormattedMessage, useIntl } from "react-intl";

export function ArchivedManagementCommitteeList() {
  const intl = useIntl();
  const { data, isError } = useArchivedManagementCommittees();
  const filteredData = useSearchResults(data ?? []);

  if (isError) {
    throw new Error(
      intl.formatMessage({ id: "managementCommittee.fetchArchivesError" })
    );
  }

  if (!data) {
    return <ArchivedManagementCommitteeListSuspense />;
  }

  if (data.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="managementCommittee.noArchivedSessions" />
      </p>
    );
  }

  if (filteredData.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="managementCommittee.noMatchingArchivedSessions" />
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {filteredData.map(({ id, title, reference, meetingDate, status }) => (
        <ManagementCommitteeCard
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
