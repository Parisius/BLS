"use client";
import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GeneralMeetingRoutes } from "@/config/routes";
import {
  CurrentGeneralMeetingView,
  CurrentGeneralMeetingViewErrorBoundary,
} from "@/components/governance/general-meeting/ui/current-general-meeting-view";
import { GeneralMeetingPageBreadcrumb } from "@/components/governance/general-meeting/breadcrumbs";
import { FormattedMessage } from "react-intl";
export default function GeneralMeetingPage() {
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <GeneralMeetingPageBreadcrumb />
        <Button asChild className="gap-2">
          <Link href={GeneralMeetingRoutes.archives}>
            <FolderSearch />
            <FormattedMessage id="generalMeeting.archivesBtn" />
          </Link>
        </Button>
      </div>
      <CurrentGeneralMeetingViewErrorBoundary>
        <CurrentGeneralMeetingView />
      </CurrentGeneralMeetingViewErrorBoundary>
    </div>
  );
}
