import Link from "next/link";
import { Component } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ShareholdingActions } from "@/components/governance/shareholding/shareholding-actions";
import { SharesInfosCard } from "@/components/governance/shareholding/shares-infos-card";
import { getDictionary } from "@/lib/i18n/locale";

export default async function ShareholdingPage() {
  const { t } = await getDictionary();
  const tb = t.shareholding.breadcrumb;

  return (
    <div className="container flex flex-1 flex-col gap-10 py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard/modules" />}>
                <Component />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard/governance" />}>{tb.governance}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tb.shareholding}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ShareholdingActions />
      </div>
      <SharesInfosCard className="self-center sm:min-w-96 sm:max-w-lg" />
    </div>
  );
}
