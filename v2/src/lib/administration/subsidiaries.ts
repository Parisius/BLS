"use server";

import { apiClient, unwrap } from "@/lib/api/client";
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
