"use server";

import { apiClient, unwrap } from "@/lib/api/client";
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

export async function deleteUser(userId: string) {
  const { error } = await apiClient.DELETE("/users/{userId}", {
    params: { path: { userId } },
  });
  if (error) {
    throw new Error("Failed to delete the user");
  }
}
