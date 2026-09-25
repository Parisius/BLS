import Link from "next/link";
import { Component, Scale } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { EvaluationsList } from "@/components/evaluation/evaluations-list";
import { getDictionary } from "@/lib/i18n/locale";

export default async function EvaluationListPage() {
  const { t } = await getDictionary();
  const ta = t.evaluation;

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
              <BreadcrumbLink render={<Link href="/dashboard/evaluation" />}>{ta.breadcrumb.evaluation}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ta.breadcrumb.list}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="gap-2" render={<Link href="/dashboard/evaluation/profiles" />}>
          <Scale />
          <span className="sr-only sm:not-sr-only">{ta.list.manageProfiles}</span>
        </Button>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{ta.list.pageTitle}</h1>
      <EvaluationsList />
    </div>
  );
}
