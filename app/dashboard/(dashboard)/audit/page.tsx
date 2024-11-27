import { Newspaper, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuditRoutes } from "@/config/routes/audit";
import { HomePageBreadcrumb } from "@/components/audit/breadcrumbs";
import AuditModuleCard from "@/components/audit/ui/audit-module-card";
export default function AuditPage() {
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <HomePageBreadcrumb />
        <div className="flex items-center justify-end gap-2">
          <Button asChild variant="secondary" className="gap-2">
            <Link href={AuditRoutes.auditModulesList}>
              <Scale />
              <span className="sr-only sm:not-sr-only">
                Insérer les critères
              </span>
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href={AuditRoutes.auditsList}>
              <Newspaper />
              <span className="sr-only sm:not-sr-only">
                Consulter les audits
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <AuditModuleCard />
      </div>
    </div>
  );
}
