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
import { FormattedMessage } from "react-intl";
export function GeneralMeetingPageBreadcrumb() {
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
          <BreadcrumbLink asChild>
            <Link href={ModulesRoutes.submodules("governance")}>
              <FormattedMessage id="generalMeeting.breadcrumbItem1" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Link href={ModulesRoutes.submodules("governance")}>
              <FormattedMessage id="generalMeeting.breadcrumbItem2" />
            </Link>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
