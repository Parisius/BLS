import Link from "next/link";
import { Archive, Component } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CurrentMeetingCard } from "@/components/governance/management-committee/current-meeting-card";
import { DirectorsModal } from "@/components/governance/management-committee/directors-ui";
import { getDictionary } from "@/lib/i18n/locale";

export default async function ManagementCommitteePage() {
  const { t } = await getDictionary();
  const tg = t.managementCommittee;

  return (
    <div className="container flex flex-1 flex-col gap-10 py-5">
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
            <BreadcrumbPage>{tg.breadcrumb.managementCommittee}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap justify-center gap-2">
        <DirectorsModal />
        <Button variant="secondary" className="gap-2" render={<Link href="/dashboard/governance/management-committee/archives" />}>
          <Archive />
          {tg.archivesButton}
        </Button>
      </div>

      <CurrentMeetingCard />
    </div>
  );
}
