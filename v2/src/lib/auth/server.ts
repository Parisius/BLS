import "server-only";
import { cache } from "react";
import { getCurrentUser } from "@/lib/administration/users";
import { makePermissionChecker, type PermissionChecker } from "./permissions";

/** The signed-in user, fetched once per request. `null` when it can't be read (the backend still enforces access). */
export const getSessionUser = cache(async () => {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
});

export async function getPermissionChecker(): Promise<PermissionChecker & { known: boolean }> {
  const user = await getSessionUser();
  return { ...makePermissionChecker(user?.permissions), known: !!user };
}
