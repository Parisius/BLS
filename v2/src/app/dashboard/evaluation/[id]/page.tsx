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
import { EvaluationDetailView } from "@/components/evaluation/evaluation-detail-view";
import { getDictionary } from "@/lib/i18n/locale";

export default async function EvaluationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { t } = await getDictionary();
  const ta = t.evaluation;

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
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
            <BreadcrumbLink render={<Link href="/dashboard/evaluation/list" />}>{ta.breadcrumb.list}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ta.breadcrumb.details}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EvaluationDetailView evaluationId={id} />
    </div>
  );
}
