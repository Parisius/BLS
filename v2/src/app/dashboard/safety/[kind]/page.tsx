import Link from "next/link";
import { notFound } from "next/navigation";
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
import { CreateSafetyCard } from "@/components/safety/create-safety-card";
import { KIND_KEY, isSafetyKind } from "@/lib/safety/kinds";
import { getDictionary } from "@/lib/i18n/locale";

export default async function SafetyKindPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isSafetyKind(kind)) notFound();
  const { t } = await getDictionary();
  const tk = t.safety.kinds[KIND_KEY[kind]];

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
              <BreadcrumbLink render={<Link href="/dashboard/safety" />}>{t.safety.breadcrumb.safety}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tk.home}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="gap-2" render={<Link href={`/dashboard/safety/${kind}/list`} />}>
          <FolderSearch />
          {tk.view}
        </Button>
      </div>
      <CreateSafetyCard kind={kind} />
    </div>
  );
}
