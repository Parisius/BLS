"use client";
import { FolderSearch, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ManagementCommitteeRoutes } from "@/config/routes";
import {
  CurrentManagementCommitteeView,
  CurrentManagementCommitteeViewErrorBoundary,
} from "@/components/governance/management-committee/ui/current-management-committee-view";
import { ManagementCommitteePageBreadcrumb } from "@/components/governance/management-committee/breadcrumbs";
import DirectorsModal from "@/components/governance/management-committee/modals/directors-modal";
import { FormattedMessage } from "react-intl";
export default function ManagementCommitteePage() {
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <ManagementCommitteePageBreadcrumb />
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <DirectorsModal asChild>
            <Button variant="secondary" className="gap-2">
              <Users />
              <FormattedMessage id="managementCommittee.viewDirectorsButton" />
            </Button>
          </DirectorsModal>
          <Button asChild className="gap-2">
            <Link href={ManagementCommitteeRoutes.archives}>
              <FolderSearch />
              <FormattedMessage id="managementCommittee.viewArchivesButton" />
            </Link>
          </Button>
        </div>
      </div>
      <CurrentManagementCommitteeViewErrorBoundary>
        <CurrentManagementCommitteeView />
      </CurrentManagementCommitteeViewErrorBoundary>
    </div>
  );
}
