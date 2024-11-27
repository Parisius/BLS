import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditModulesListPageBreadcrumb } from "@/components/audit/breadcrumbs";
import ModulesList from "@/components/audit/ui/modules-list";
import Link from "next/link";
import { AuditRoutes } from "@/config/routes/audit";
export default function ModulesListPage() {
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <AuditModulesListPageBreadcrumb />
        <Button asChild className="gap-2">
          <Link href={AuditRoutes.auditsList}>
            <Newspaper />
            <span className="sr-only sm:not-sr-only">Consulter les audits</span>
          </Link>
        </Button>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        Choisir un module
      </h1>
      <ModulesList />
    </div>
  );
}
