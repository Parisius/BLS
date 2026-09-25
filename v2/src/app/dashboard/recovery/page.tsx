import Link from "next/link";
import { Component, FolderSearch } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CreateRecoveryCard } from "@/components/recovery/create-recovery-card";
import { getDictionary } from "@/lib/i18n/locale";

export default async function RecoveryPage() {
  const { t } = await getDictionary();
  const ta = t.recovery;

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
              <BreadcrumbPage>{ta.breadcrumb.recovery}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="gap-2" render={<Link href="/dashboard/recovery/list" />}>
          <FolderSearch />
          {ta.hub.viewRecoveries}
        </Button>
      </div>
      <CreateRecoveryCard />
    </div>
  );
}
