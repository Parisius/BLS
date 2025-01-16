"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArchivesPageBreadcrumb } from "@/components/governance/general-meeting/breadcrumbs";
import {
  OpenSessionButton,
  OpenSessionButtonErrorBoundary,
} from "@/components/governance/general-meeting/buttons/open-session-button";
import {
  ArchivedGeneralMeetingList,
  ArchivedGeneralMeetingListErrorBoundary,
} from "@/components/governance/general-meeting/ui/archived-general-meeting-list";
import { Portal } from "@/components/ui/portal";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { FormattedMessage } from "react-intl";
export default function ArchivedGeneralMeetingPage() {
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
          <FormattedMessage id="generalMeeting.archives_page_title" />
        </h1>
        <div className="flex items-end justify-between gap-10 sm:items-center sm:justify-end">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <span
              id="session-year-label"
              className="text-nowrap text-foreground/75"
            >
              <FormattedMessage id="generalMeeting.year_filter" />
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
        <ArchivedGeneralMeetingListErrorBoundary>
          <ArchivedGeneralMeetingList />
        </ArchivedGeneralMeetingListErrorBoundary>
      </div>
    </SearchProvider>
  );
}
