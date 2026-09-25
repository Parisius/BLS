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
import { AddSafetyDialog } from "@/components/safety/add-safety-dialog";
import { SafetyList } from "@/components/safety/safety-list";
import { KIND_KEY, isSafetyKind } from "@/lib/safety/kinds";
import { getDictionary } from "@/lib/i18n/locale";

export default async function SafetyListPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isSafetyKind(kind)) notFound();
  const { t } = await getDictionary();
  const tk = t.safety.kinds[KIND_KEY[kind]];

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
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
              <BreadcrumbLink render={<Link href={`/dashboard/safety/${kind}`} />}>{tk.home}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tk.list}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AddSafetyDialog kind={kind} />
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{tk.pageTitle}</h1>
      <SafetyList kind={kind} />
    </div>
  );
}
