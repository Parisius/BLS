import Link from "next/link";
import { notFound } from "next/navigation";
import { Component } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SafetyDetailView } from "@/components/safety/safety-detail-view";
import { KIND_KEY, isSafetyKind } from "@/lib/safety/kinds";
import { getDictionary } from "@/lib/i18n/locale";

export default async function SafetyDetailsPage({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!isSafetyKind(kind)) notFound();
  const { t } = await getDictionary();
  const tk = t.safety.kinds[KIND_KEY[kind]];

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
            <BreadcrumbLink render={<Link href="/dashboard/safety" />}>{t.safety.breadcrumb.safety}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/dashboard/safety/${kind}`} />}>{tk.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/dashboard/safety/${kind}/list`} />}>{tk.list}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t.safety.breadcrumb.details}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SafetyDetailView kind={kind} guaranteeId={id} />
    </div>
  );
}
