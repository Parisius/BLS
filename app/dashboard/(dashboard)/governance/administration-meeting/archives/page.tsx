"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArchivesPageBreadcrumb } from "@/components/governance/administration-meeting/breadcrumbs";
import {
  OpenSessionButton,
  OpenSessionButtonErrorBoundary,
} from "@/components/governance/administration-meeting/buttons/open-session-button";
import {
  ArchivedAdministrationMeetingList,
  ArchivedAdministrationMeetingListErrorBoundary,
} from "@/components/governance/administration-meeting/ui/archived-administration-meeting-list";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { Portal } from "@/components/ui/portal";
import { FormattedMessage } from "react-intl";
export default function ArchivedAdministrationMeetingPage() {
  return (
    <SearchProvider>
      <Portal containerId="search-input-container">
        <SearchInput />
      </Portal>
      <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <ArchivesPageBreadcrumb />
          <OpenSessionButtonErrorBoundary>
            <OpenSessionButton />
          </OpenSessionButtonErrorBoundary>
        </div>
        <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          <FormattedMessage id="sessionAdministrator.archived_meeting_title" />
        </h1>
        <div className="flex items-end justify-between gap-10 sm:items-center sm:justify-end">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <span
              id="session-year-label"
              className="text-nowrap text-foreground/75"
            >
              <FormattedMessage id="sessionAdministrator.session_year_label" />
            </span>
            <Select defaultValue="2024">
              <SelectTrigger
                aria-labelledby="session-year-label"
                className="min-w-24 bg-card"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ArchivedAdministrationMeetingListErrorBoundary>
          <ArchivedAdministrationMeetingList />
        </ArchivedAdministrationMeetingListErrorBoundary>
      </div>
    </SearchProvider>
  );
}
