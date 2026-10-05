"use server";

import { apiClient, unwrap, toResult } from "@/lib/api/client";
import type { ActionResult } from "@/lib/api/result";
import type { components } from "@/lib/api/schema";

export type Subsidiary = components["schemas"]["Subsidiary"];

export async function getAllSubsidiaries() {
  return unwrap(await apiClient.GET("/subsidiaries"));
}

export interface CreateSubsidiaryArgs {
  title: string;
  country: string;
  address: string;
}

export async function createSubsidiary(args: CreateSubsidiaryArgs) {
  return unwrap(
    await apiClient.POST("/subsidiaries", {
      body: {
        name: args.title,
        country: args.country,
        address: args.address,
      },
    }),
  );
}

export async function updateSubsidiary(subsidiaryId: string, args: CreateSubsidiaryArgs): Promise<ActionResult<Subsidiary>> {
  return toResult<Subsidiary>(
    await apiClient.PUT("/subsidiaries/{subsidiaryId}", {
      params: { path: { subsidiaryId } },
      body: { name: args.title, country: args.country, address: args.address },
    }),
    "Failed to update the subsidiary",
  );
}

/** 409 while users are still attached to it. */
export async function deleteSubsidiary(subsidiaryId: string): Promise<ActionResult> {
  return toResult(
    await apiClient.DELETE("/subsidiaries/{subsidiaryId}", { params: { path: { subsidiaryId } } }),
    "Failed to delete the subsidiary",
  );
}
