"use server";

import { apiClient, unwrap, toResult } from "@/lib/api/client";
import type { ActionResult } from "@/lib/api/result";
import type { components } from "@/lib/api/schema";

export type User = components["schemas"]["User"];

export async function getAllUsers() {
  return unwrap(await apiClient.GET("/users"));
}

export type CurrentUser = components["schemas"]["CurrentUser"];

export async function getCurrentUser() {
  return unwrap(await apiClient.GET("/current-user"));
}

export interface CreateUserArgs {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roleId: string;
  subsidiaryId: string;
}

export async function createUser(args: CreateUserArgs) {
  return unwrap(
    await apiClient.POST("/users", {
      body: {
        username: args.username,
        firstname: args.firstname,
        lastname: args.lastname,
        email: args.email,
        role_id: args.roleId,
        subsidiary_id: args.subsidiaryId,
      },
    }),
  );
}

export async function updateUser(userId: string, args: CreateUserArgs): Promise<ActionResult<User>> {
  return toResult<User>(
    await apiClient.PUT("/users/{userId}", {
      params: { path: { userId } },
      body: {
        username: args.username,
        firstname: args.firstname,
        lastname: args.lastname,
        email: args.email,
        role_id: args.roleId,
        subsidiary_id: args.subsidiaryId,
      },
    }),
    "Failed to update the user",
  );
}

/** The last super admin can't be deleted, deactivated or demoted: the backend answers 409 with the reason. */
export async function deleteUser(userId: string): Promise<ActionResult> {
  return toResult(await apiClient.DELETE("/users/{userId}", { params: { path: { userId } } }), "Failed to delete the user");
}

export async function setUserActive(userId: string, active: boolean): Promise<ActionResult<User>> {
  const path = { params: { path: { userId } } };
  return toResult<User>(
    active
      ? await apiClient.POST("/users/{userId}/reactivate", path)
      : await apiClient.POST("/users/{userId}/deactivate", path),
    "Failed to change the account status",
  );
}

export async function resetUserPassword(userId: string): Promise<ActionResult> {
  return toResult(
    await apiClient.POST("/users/{userId}/reset-password", { params: { path: { userId } } }),
    "Failed to reset the password",
  );
}
