"use server";

import { apiClient, unwrap, toResult } from "@/lib/api/client";
import type { ActionResult } from "@/lib/api/result";
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

export interface UpdateRoleArgs {
  title: string;
  permissionIds: string[];
}

export async function updateRole(roleId: string, args: UpdateRoleArgs): Promise<ActionResult<Role>> {
  return toResult<Role>(
    await apiClient.PUT("/roles/{roleId}", {
      params: { path: { roleId } },
      body: { name: args.title, permissions: args.permissionIds },
    }),
    "Failed to update the role",
  );
}

/** 409 when users still have the role: the backend's message says so. */
export async function deleteRole(roleId: string): Promise<ActionResult> {
  return toResult(await apiClient.DELETE("/roles/{roleId}", { params: { path: { roleId } } }), "Failed to delete the role");
}
