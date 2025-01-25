"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModulesRoutes } from "@/config/routes";
import { Component } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";
export function HomePageBreadcrumb() {
  const intl = useIntl();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={ModulesRoutes.modules}>
              <Component />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {intl.formatMessage({
              id: "contract.contract.breadcrumb.contract",
            })}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
