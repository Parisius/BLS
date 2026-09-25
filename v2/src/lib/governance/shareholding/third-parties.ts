"use server";

import { apiClient, unwrap } from "@/lib/api/client";

export interface ThirdParty {
  id: string;
  name: string;
  grade?: string;
}

export async function getAllThirdParties(): Promise<ThirdParty[]> {
  const data = unwrap(await apiClient.GET("/tiers"));
  return data.map((item) => ({ id: item.id!, name: item.name ?? "", grade: item.grade }));
}
