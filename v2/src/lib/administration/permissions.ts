"use server";

import { apiClient, unwrap } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type Permission = components["schemas"]["Permission"];

export async function getAllPermissions() {
  return unwrap(await apiClient.GET("/permissions"));
}
