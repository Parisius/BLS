"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type AdministratorResponse = components["schemas"]["CaAdministrator"];

export type AdministratorType = "individual" | "corporate";
export type AdministratorQuality = "shareholder" | "non_shareholder";
export type AdministratorRole =
  | "ca_president"
  | "ca_executive_admin"
  | "ca_non_executive_admin"
  | "ca_independent_admin";

export interface Mandate {
  id: string;
  startDate?: string;
  endDate?: string;
  renewalDate?: string;
  status?: string;
}

export interface Administrator {
  id: string;
  name: string;
  nationality?: string;
  address?: string;
  birthDate?: string;
  birthPlace?: string;
  shares?: number;
  sharePercentage?: number;
  type: AdministratorType;
  quality?: AdministratorQuality;
  role?: AdministratorRole;
  denomination?: string;
  companyHeadOffice?: string;
  companyNationality?: string;
  mandates: Mandate[];
}

function mapAdministrator(item: AdministratorResponse): Administrator {
  return {
    id: item.id!,
    name: item.name ?? "",
    nationality: item.nationality,
    address: item.address,
    birthDate: item.birthdate,
    birthPlace: item.birthplace,
    shares: item.shares != null ? Number(item.shares) : undefined,
    sharePercentage: item.share_percentage != null ? Number(item.share_percentage) : undefined,
    type: item.type === "corporate" ? "corporate" : "individual",
    quality: item.quality === "non_shareholder" || item.quality === "shareholder" ? item.quality : undefined,
    role: (item.function as AdministratorRole | null) ?? undefined,
    denomination: item.denomination,
    companyHeadOffice: item.company_head_office,
    companyNationality: item.company_nationality,
    mandates: (item.mandates as { id?: string; appointment_date?: string; expiry_date?: string; renewal_date?: string; status?: string }[] ?? []).map((m) => ({
      id: m.id!,
      startDate: m.appointment_date,
      endDate: m.expiry_date,
      renewalDate: m.renewal_date,
      status: m.status,
    })),
  };
}

export async function getAllAdministrators() {
  const data = unwrap(await apiClient.GET("/ca_administrators"));
  return data.map(mapAdministrator);
}

export interface AdministratorFormArgs {
  name: string;
  nationality: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  shares: number;
  sharePercentage: number;
  type: AdministratorType;
  quality: AdministratorQuality;
  role: AdministratorRole;
  denomination?: string;
  companyHeadOffice?: string;
  companyNationality?: string;
}

export async function createAdministrator(args: AdministratorFormArgs & { mandateStartDate: string }) {
  const data = unwrap(
    await apiClient.POST("/ca_administrators", {
      body: {
        name: args.name,
        nationality: args.nationality,
        address: args.address,
        birthdate: toBackendDate(args.birthDate),
        birthplace: args.birthPlace,
        shares: String(args.shares),
        share_percentage: String(args.sharePercentage),
        type: args.type,
        quality: args.quality,
        function: args.role,
        denomination: args.denomination,
        company_head_office: args.companyHeadOffice,
        company_nationality: args.companyNationality,
        appointment_date: toBackendDate(args.mandateStartDate),
      },
    }),
  );
  return mapAdministrator(data);
}

export async function updateAdministrator(administratorId: string, args: AdministratorFormArgs) {
  const data = unwrap(
    await apiClient.PUT("/ca_administrators/{administratorId}", {
      params: { path: { administratorId } },
      body: {
        name: args.name,
        nationality: args.nationality,
        address: args.address,
        birthdate: toBackendDate(args.birthDate),
        birthplace: args.birthPlace,
        shares: String(args.shares),
        share_percentage: String(args.sharePercentage),
        type: args.type,
        quality: args.quality,
        function: args.role,
        denomination: args.denomination,
        company_head_office: args.companyHeadOffice,
        company_nationality: args.companyNationality,
      },
    }),
  );
  return mapAdministrator(data);
}

export async function deleteAdministrator(administratorId: string) {
  const { error } = await apiClient.DELETE("/ca_administrators/{administratorId}", {
    params: { path: { administratorId } },
  });
  throwIfError(error, "Failed to delete the administrator");
}
