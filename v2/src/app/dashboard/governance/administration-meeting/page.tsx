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
import { CurrentMeetingCard } from "@/components/governance/administration-meeting/current-meeting-card";
import { AdministratorsModal } from "@/components/governance/administration-meeting/administrators-ui";
import { getDictionary } from "@/lib/i18n/locale";

export default async function AdministrationMeetingPage() {
  const { t } = await getDictionary();
  const tg = t.administrationMeeting;

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
            <BreadcrumbPage>{tg.breadcrumb.administrationMeeting}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap justify-center gap-2">
        <AdministratorsModal />
        <Button variant="secondary" className="gap-2" render={<Link href="/dashboard/governance/administration-meeting/archives" />}>
          <Archive />
          {tg.archivesButton}
        </Button>
      </div>

      <CurrentMeetingCard />
    </div>
  );
}
