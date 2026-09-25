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
import { CurrentMeetingCard } from "@/components/governance/general-meeting/current-meeting-card";
import { getDictionary } from "@/lib/i18n/locale";

export default async function GeneralMeetingPage() {
  const { t } = await getDictionary();
  const tg = t.generalMeeting;

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
            <BreadcrumbPage>{tg.breadcrumb.generalMeeting}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-center">
        <Button variant="secondary" className="gap-2" render={<Link href="/dashboard/governance/general-meeting/archives" />}>
          <Archive />
          {tg.archivesButton}
        </Button>
      </div>

      <CurrentMeetingCard />
    </div>
  );
}
