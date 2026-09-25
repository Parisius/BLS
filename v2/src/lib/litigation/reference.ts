"use server";

import { apiClient, unwrap } from "@/lib/api/client";

export interface LitigationRef {
  id: string;
  title: string;
}

/** Case natures ("matières"). Shared with Legal Monitoring. */
export async function getAllNatures(): Promise<LitigationRef[]> {
  const data = unwrap(await apiClient.GET("/litigation/natures"));
  return data.map((item) => ({ id: item.id!, title: item.name ?? "" }));
}

/** Jurisdictions. Shared with Legal Monitoring. */
export async function getAllJurisdictions(): Promise<LitigationRef[]> {
  const data = unwrap(await apiClient.GET("/litigation/jurisdiction"));
  return data.map((item) => ({ id: item.id!, title: item.name ?? "" }));
}

export interface Lawyer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export async function getAllLawyers(): Promise<Lawyer[]> {
  const data = unwrap(await apiClient.GET("/litigation/lawyers"));
  return data.map((item) => ({ id: item.id!, name: item.name ?? "", email: item.email, phone: item.phone }));
}
