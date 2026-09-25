"use server";

import { apiClient, unwrap } from "@/lib/api/client";

export interface LinkOption {
  id: string;
  title: string;
}

/** Guarantees a recovery can be attached to: only those already formalized. */
export async function getFormalizedGuarantees(): Promise<LinkOption[]> {
  const data = unwrap(await apiClient.GET("/guarantees", { params: { query: { phase: "formalized" } } }));
  return data.map((item) => ({ id: item.id!, title: item.name ?? "" }));
}

/** Contracts a recovery without guarantee can be attached to. */
export async function getRecoverableContracts(): Promise<LinkOption[]> {
  const data = unwrap(await apiClient.GET("/contracts", { params: { query: { filter: "recover_without_guarantee" } } }));
  return data.map((item) => ({ id: item.id!, title: item.title ?? "" }));
}
