"use server";

import { apiClient, unwrap } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type Role = components["schemas"]["Role"];

export async function getAllRoles() {
  return unwrap(await apiClient.GET("/roles"));
}

export interface CreateRoleArgs {
  title: string;
  permissionIds: string[];
}

export async function createRole(args: CreateRoleArgs) {
  return unwrap(
    await apiClient.POST("/roles", {
      body: {
        name: args.title,
        permissions: args.permissionIds,
      },
    }),
  );
}
